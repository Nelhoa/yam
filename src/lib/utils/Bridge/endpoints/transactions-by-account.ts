import { BRIDGE_CLIENT_ID, BRIDGE_CLIENT_SECRET } from '$env/static/private';
import type { BridgeTransaction } from '../bridge-types';

type params = {
	token: string;
	accountId: number;
	limit?: string;
	since?: string;
	after?: string;
	until?: string;
	nextUri?: string;
};

type res_getAccountTransactions = {
	ressources: BridgeTransaction[];
	pagination?: {
		next_uri?: string;
	};
};

export async function getAccountTransactions(p: params) {
	const limit = p.limit ? `limit=${p.limit}` : '';
	const since = p.since ? `since=${p.since}` : '';
	const after = p.after ? `after=${p.after}` : '';
	const until = p.until ? `until=${p.until}` : '';
	const queryParams = [limit, since, after, until].filter((item) => item !== '').join('&');

	const url = p.nextUri
		? `https://api.bridgeapi.io${p.nextUri}`
		: `https://api.bridgeapi.io/v2/accounts/${p.accountId}/transactions?${queryParams}`;
	const response = await fetch(url, {
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
	return data as res_getAccountTransactions;
}
