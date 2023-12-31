export async function GET({ locals }) {
	const session = await locals.getSession();
	if (session) {
		const signOut = await locals.sb.auth.signOut();
		return new Response(JSON.stringify(signOut), { status: 200 });
	}
	return new Response(JSON.stringify({ message: 'ok' }), { status: 200 });
}
