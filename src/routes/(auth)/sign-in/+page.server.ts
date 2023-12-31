import { PUBLIC_SITE_URL } from '$env/static/public';
import { fail, redirect } from '@sveltejs/kit';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const signinSchema = z.object({
	email: z.string().email('Adresse email invalide')
});

export async function load({ locals }) {
	const session = await locals.getSession();
	if (session) throw redirect(308, '/organisations');
	const form = superValidate(signinSchema);
	return { form };
}

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, signinSchema);
		if (!form.valid) {
			return fail(400, { form });
		}
		const supabase = event.locals.sb;
		const { data, error } = await supabase.auth.signInWithOtp({
			email: form.data.email,
			options: {
				emailRedirectTo: `${PUBLIC_SITE_URL}/auth/callback?redirect=otpFun`,
				shouldCreateUser: false
			}
		});
		if (error?.status === 400) {
			// return fail(400, { form, message: 'problème' });
			return setError(form, 'email', 'Adresse inconnue. Êtes-vous bien inscrit ?');
		}
		if (error?.status === 429) {
			return message(
				form,
				'Pour des questions de sécurité, il est impossible de faire plus d’une tentative de connexion par minute.'
			);
		}
		if (error) {
			console.log(error);
			return message(form, error.message);
		}
		if (!error) {
			throw redirect(303, `/verify-otp?type=magiclink&email=${form.data.email}`);
		}
	}
};
