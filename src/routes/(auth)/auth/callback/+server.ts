import { PUBLIC_SITE_URL } from '$env/static/public';
import { redirect } from '@sveltejs/kit';

export const GET = async ({ url, locals: { sb } }) => {
	const code = url.searchParams.get('code');
	const redir = url.searchParams.get('redirect');
	console.log(redir);

	if (code) {
		await sb.auth.exchangeCodeForSession(code);
	}

	throw redirect(303, `${PUBLIC_SITE_URL}/organisations`);
};
