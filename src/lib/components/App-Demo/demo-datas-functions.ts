import { PUBLIC_SITE_URL } from '$env/static/public';
import type { Organisation } from '$lib/models/structurals/organisation';
import { reloadOrganisation } from '$lib/stores/organisations-store';
import type { supaClient } from '$lib/types/customTypes';

export async function deleteDemoDatas(organisation: Organisation, sb: supaClient) {
	const response = await fetch(`${PUBLIC_SITE_URL}/api/demo/${organisation.info.id}`, {
		method: 'DELETE'
	});
	if (response.status === 204) return reloadOrganisation(sb, organisation.info.id);
	console.log(await response.json());
	return false;
}

export async function createDemoDatas(organisation: Organisation, sb: supaClient) {
	const response = await fetch(`${PUBLIC_SITE_URL}/api/demo/${organisation.info.id}`, {
		method: 'PUT'
	});
	if (response.status === 204) return reloadOrganisation(sb, organisation.info.id);
	console.log(await response.json());
	return false;
}
