import type { NDG_Institution } from '$lib/types/nordigen';
import type { AccessToken } from './access-token-get';
import { NordigenURL } from './url';

export async function getInstitutionsList(accessToken: AccessToken, countryCode: string) {
	const res_BankList = await fetch(`${NordigenURL}/api/v2/institutions/?country=${countryCode}`, {
		method: 'GET',
		headers: {
			accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken.access}`
		}
	});
	const res = await res_BankList.json();
	if (res.status_code) throw res;
	return res as NDG_Institution[];
}
