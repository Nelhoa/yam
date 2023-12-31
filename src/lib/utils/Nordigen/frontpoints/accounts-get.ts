import { PUBLIC_SITE_URL } from '$env/static/public';
import { newAlert } from '$lib/stores/alerts-store';
import type { NDG_Requisition } from '$lib/types/nordigen';
import type { NordigenAccountInfos } from '$lib/utils/Nordigen/utils/nordigen-client';

export async function getAccounts(bankId: number, organisationId: number) {
	try {
		const response = await fetch(
			`${PUBLIC_SITE_URL}/organisations/${organisationId}/banks/${bankId}/nordigen/get-accounts-list`,
			{
				method: 'GET'
			}
		);
		const data = await response.json();
		if (data?.message) throw data;
		return data as { requisition: NDG_Requisition; accounts: NordigenAccountInfos[] };
	} catch (err: any) {
		newAlert(err?.message ?? 'Un problème est survenu lors du chargement des comptes bancaires');
		console.error(err);
	}
}
