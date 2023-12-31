import type { NDG_Transactions } from '$lib/types/nordigen';
import type dayjs from 'dayjs';
import type { AccessToken } from './access-token-get';
import { NordigenURL } from './url';

type params = {
	accessToken: AccessToken;
	account_id: string;
	date_from?: dayjs.Dayjs;
	date_to?: dayjs.Dayjs;
};

export async function getTransactions(p: params) {
	const from = p.date_from ? `limit=${p.date_from.format('YYYY-MM-DD')}` : '';
	const to = p.date_to ? `since=${p.date_to.format('YYYY-MM-DD')}` : '';
	const queryParams = [from, to].filter((item) => item !== '').join('&');

	const res_getTransactions = await fetch(
		`${NordigenURL}/api/v2/accounts/${p.account_id}/transactions/${queryParams}`,
		{
			method: 'GET',
			headers: {
				accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${p.accessToken.access}`
			}
		}
	);

	const res = await res_getTransactions.json();
	if (res.status_code) throw res;
	return res as { transactions: NDG_Transactions };
}
