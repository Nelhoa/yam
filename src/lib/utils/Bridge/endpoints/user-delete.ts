import { BRIDGE_CLIENT_ID, BRIDGE_CLIENT_SECRET } from '$env/static/private';

type params = {
	uuid: string;
	password: string;
};

type res_deleteUser = undefined;

export async function deleteUser(p: params) {
	const response = await fetch(`https://api.bridgeapi.io/v2/users/${p.uuid}/delete`, {
		method: 'POST',
		headers: {
			'Bridge-Version': '2021-06-01',
			'Content-Type': 'application/json',
			'Client-Id': BRIDGE_CLIENT_ID,
			'Client-Secret': BRIDGE_CLIENT_SECRET
		},
		body: JSON.stringify({
			password: p.password
		})
	});
	let data = await response.json();
	if (data?.type) throw Error(data.message);
	return data as res_deleteUser;
}
