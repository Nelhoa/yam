import { fail, redirect } from '@sveltejs/kit';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const typeSchema = z.enum(['magiclink', 'signup']);
const emailSchema = z.string().email();
const otpSchema = z.object({
	otp: z.string().refine((value) => /^\d{6}$/.test(value), {
		message: 'Renseignez un code à 6 chiffres'
	})
});
type EmailParam = z.infer<typeof emailSchema>;
type TypeParam = z.infer<typeof typeSchema>;

export async function load({ url, locals }) {
	const session = await locals.getSession();
	if (session) throw redirect(303, '/organisations');
	const form = superValidate(otpSchema);
	const { type, email } = checkParams(url);
	return { form, type, email };
}

export const actions = {
	default: async (event) => {
		let email: EmailParam;
		let type: TypeParam;
		try {
			const params = checkParams(event.url);
			email = params.email;
			type = params.type;
		} catch (err) {
			throw redirect(300, '/sign-in');
		}
		const form = await superValidate(event, otpSchema);
		if (!form.valid) {
			return fail(400, { form });
		}
		const supabase = event.locals.sb;
		const { data, error } = await supabase.auth.verifyOtp({
			email,
			type,
			token: form.data.otp
		});
		if (error?.status === 401) return setError(form, 'otp', 'Code invalide ou expiré');
		if (data.session) {
			throw redirect(303, '/organisations');
		}
	}
};

function checkParams(url: URL) {
	const type = url.searchParams.get('type') as TypeParam;
	const email = url.searchParams.get('email') as EmailParam;
	typeSchema.parse(type);
	emailSchema.parse(email);
	return { type, email };
}
