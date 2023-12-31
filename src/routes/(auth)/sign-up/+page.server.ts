import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';
import { supabasePrivate } from '$lib/utils/Private/supabasePrivate.js';
import { PUBLIC_SITE_URL } from '$env/static/public';
import dayjs from 'dayjs';
import { isSignedUp } from './util-get-is-signed-up.js';
import { signupSchema } from './signup-schema.js';
import { parsePhoneNumber, type CountryCode, PhoneNumber } from 'libphonenumber-js';
import { wait } from '$lib/utils/Public/wait.js';

export async function load({ locals }) {
	let profile = locals.profile;
	const session = await locals.getSession();

	if (session && !profile) {
		const { data: profileData } = await locals.sb
			.from('profiles')
			.select()
			.eq('id', session.user.id)
			.maybeSingle();
		profile = profileData;
	}

	const form = await superValidate(signupSchema);
	if (!session) return { form };
	if (!profile) {
		const { data: profileData } = await locals.sb
			.from('profiles')
			.select()
			.eq('id', session.user.id)
			.maybeSingle();
		profile = profileData;
	}
	if (isSignedUp(profile)) throw redirect(303, '/');

	return { profile, form };
}

export const actions = {
	default: async (event) => {
		let phone: PhoneNumber;
		const form = await superValidate(event, signupSchema);

		await wait(500);

		if (!form.valid) return fail(400, { form });

		try {
			phone = parsePhoneNumber(form.data.phone, form.data.countryCode as CountryCode);
		} catch (err) {
			return setError(form, 'phone', 'Numéro invalide');
		}

		if (!phone.isValid()) return setError(form, `phone`, 'Numéro invalide');

		const session = await event.locals.getSession();
		if (!session) {
			if (await isEmailRegistered(form.data.email))
				return setError(
					form,
					'email',
					'Adresse déjà utilisée. Rendez-vous sur « Se connecter » ou inscrivez-vous avec une autre adresse.'
				);

			const { error } = await event.locals.sb.auth.signInWithOtp({
				email: form.data.email,
				options: {
					data: {
						first_name: form.data.firstName,
						last_name: form.data.lastName,
						company: form.data.company,
						country: form.data.country,
						phone: phone.formatInternational(),
						terms_consent: form.data.termsConsent
					},
					emailRedirectTo: `${PUBLIC_SITE_URL}/auth/callback`
				}
			});
			if (error) {
				console.log(error);
				return message(
					form,
					'Une erreur est survenue lors de la création du compte. Veuillez réessayer ou contacter notre support.'
				);
			}
			throw redirect(303, `/verify-otp?type=signup&email=${form.data.email}`);
		}

		if (session) {
			const { data: newProfile, error } = await event.locals.sb
				.from('profiles')
				.update({
					email:
						typeof session.user.email === 'string' && session.user.email.length > 0
							? session.user.email
							: form.data.email,
					phone:
						typeof session.user.phone === 'string' && session.user.phone.length > 0
							? session.user.phone
							: phone.formatInternational(),
					first_name: form.data.firstName,
					last_name: form.data.lastName,
					country: form.data.country,
					company: form.data.company,
					last_terms_accepted: dayjs().format('YYYY-MM-DD')
				})
				.eq('id', session.user.id)
				.select()
				.maybeSingle();

			event.locals.profile = newProfile;
			if (error) {
				return message(
					form,
					'Une erreur est survenue. Veuillez réessayer ou contacter notre support.'
				);
			}
			throw redirect(303, '/organisations');
		}

		return message(form, 'Une erreur est survenue');
	}
};

async function isEmailRegistered(email: string) {
	const { data: userEmail } = await supabasePrivate
		.from('profiles')
		.select('email')
		.eq('email', email)
		.maybeSingle();
	return userEmail;
}
