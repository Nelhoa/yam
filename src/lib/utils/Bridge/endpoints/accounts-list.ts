import { BRIDGE_CLIENT_ID, BRIDGE_CLIENT_SECRET } from '$env/static/private';
import type { BridgeAccount, bridgeBankCapabilities } from '../bridge-types';

type params = {
	itemId: number;
	token: string;
	after?: string;
	limit?: number;
};

type res_getAccountsList = {
	ressources: BridgeAccount[];
	pagination?: {
		next_uri?: string;
	};
};

export async function getAccountsList(p: params) {
	const itemId = `item_id=${p.itemId}`;
	const limit = p.limit ? `limit=${p.limit}` : '';
	const after = p.after ? `after=${p.after}` : '';
	const queryParams = [itemId, limit, after].filter((item) => item !== '').join('&');

	const response = await fetch(`https://api.bridgeapi.io/v2/accounts?${queryParams}`, {
		method: 'GET',
		headers: {
			'Bridge-Version': '2021-06-01',
			'Content-Type': 'application/json',
			'Client-Id': BRIDGE_CLIENT_ID,
			'Client-Secret': BRIDGE_CLIENT_SECRET,
			Authorization: `Bearer ${p.token}`
		}
	});
	const data = await response.json();
	if (data?.type) throw Error(data.message);
	return data as res_getAccountsList;
}
