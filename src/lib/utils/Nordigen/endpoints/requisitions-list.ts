import type { NDG_Requisition } from '$lib/types/nordigen';
import type { AccessToken } from './access-token-get';
import { NordigenURL } from './url';

export type NDG_RequisitionList = {
	requisitions: {
		count: number;
		next: string;
		previous: string;
		results: NDG_Requisition[];
	};
};

export async function getRequisitionsList(accessToken: AccessToken) {
	const res_getRequisition = await fetch(`${NordigenURL}/api/v2/requisitions/`, {
		method: 'GET',
		headers: {
			accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken.access}`
		}
	});

	const res = await res_getRequisition.json();
	if (res.status_code) throw res;
	return res as NDG_Requisition[];
}
