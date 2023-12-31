import { BRIDGE_CLIENT_ID, BRIDGE_CLIENT_SECRET } from '$env/static/private';

type params = {
	token: string;
	country: string;
	prefill_email: string;
	redirect_url?: string;
};

type res_addItem = { redirect_url: string };

export async function addItem(p: params) {
	const response = await fetch('https://api.bridgeapi.io/v2/connect/items/add', {
		method: 'POST',
		headers: {
			'Bridge-Version': '2021-06-01',
			'Content-Type': 'application/json',
			'Client-Id': BRIDGE_CLIENT_ID,
			'Client-Secret': BRIDGE_CLIENT_SECRET,
			Authorization: `Bearer ${p.token}`
		},
		body: JSON.stringify({
			country: p.country,
			prefill_email: p.prefill_email,
			redirect_url: p.redirect_url
		})
	});
	const data = await response.json();
	if (data?.type) throw Error(data.message);
	return data as res_addItem;
}
