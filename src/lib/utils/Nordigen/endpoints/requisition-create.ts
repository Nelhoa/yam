import { v4 as uuidv4 } from 'uuid';
import type { AccessToken } from './access-token-get';
import type { NDG_Requisition } from '$lib/types/nordigen';
import { NordigenURL } from './url';
import { PUBLIC_SITE_URL } from '$env/static/public';

type UserAgreement = {
	id: string;
	created: string;
	max_historical_days: number;
	access_valid_for_days: number;
	access_scope: ['balances', 'details', 'transactions'];
	accepted: string;
	institution_id: string;
};

export async function createRequisition(
	accessToken: AccessToken,
	institution_id: string,
	max_historical_days: number,
	user_language = 'fr'
) {
	const res_UserAgreement = await fetch(`${NordigenURL}/api/v2/agreements/enduser/`, {
		method: 'POST',
		headers: {
			accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken.access}`
		},
		body: JSON.stringify({
			institution_id,
			max_historical_days,
			access_valid_for_days: 90,
			access_scope: ['balances', 'details', 'transactions']
		})
	});

	const userAgreement = (await res_UserAgreement.json()) as UserAgreement;

	const res_CreateRequisition = await fetch(`${NordigenURL}/api/v2/requisitions/`, {
		method: 'POST',
		headers: {
			accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken.access}`
		},
		body: JSON.stringify({
			redirect: `${PUBLIC_SITE_URL}/nordigen`,
			institution_id,
			reference: uuidv4(),
			agreement: userAgreement.id,
			user_language
		})
	});
	const res = await res_CreateRequisition.json();
	if (res.status_code) throw res;
	return res as NDG_Requisition;
}
