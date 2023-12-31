import { BRIDGE_CLIENT_ID, BRIDGE_CLIENT_SECRET } from '$env/static/private';

type params = {
	token: string;
	item_id: number;
};

type res_editItem = { redirect_url: string };

export async function editItem(p: params) {
	const response = await fetch(
		`https://api.bridgeapi.io/v2/connect/items/edit?item_id=${p.item_id}`,
		{
			method: 'GET',
			headers: {
				'Bridge-Version': '2021-06-01',
				'Content-Type': 'application/json',
				'Client-Id': BRIDGE_CLIENT_ID,
				'Client-Secret': BRIDGE_CLIENT_SECRET,
				Authorization: `Bearer ${p.token}`
			}
		}
	);
	const data = await response.json();
	if (data?.type) throw Error(data.message);
	return data as res_editItem;
}
