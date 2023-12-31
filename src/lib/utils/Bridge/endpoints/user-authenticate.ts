import { BRIDGE_CLIENT_ID, BRIDGE_CLIENT_SECRET } from '$env/static/private';

type params = {
	email: string;
	password: string;
};

type res_authenticateUser = {
	access_token: string;
	expires_at: string;
	user: { email: string; uuid: string };
};

export async function authenticateUser(p: params) {
	const response = await fetch('https://api.bridgeapi.io/v2/authenticate', {
		method: 'POST',
		headers: {
			'Bridge-Version': '2021-06-01',
			'Content-Type': 'application/json',
			'Client-Id': BRIDGE_CLIENT_ID,
			'Client-Secret': BRIDGE_CLIENT_SECRET
		},
		body: JSON.stringify({
			email: p.email,
			password: p.password
		})
	});
	const data = await response.json();
	if (data?.type) throw Error(data.message);
	return data as res_authenticateUser;
}
