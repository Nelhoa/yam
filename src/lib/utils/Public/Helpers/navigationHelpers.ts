import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { loadOrganisationManagers, organisationManagers } from '$lib/stores/organisations-store';
import type { supaClient } from '$lib/types/customTypes';
import { get } from 'svelte/store';

export async function goToDashboardButton(sb: supaClient) {
	if (browser) {
		const id = localStorage.lastOrganisationId as string;
		try {
			await loadOrganisationManagers(sb);
			if (get(organisationManagers)?.find((item) => item.info.id === Number(id)))
				return goto(`/organisations/${id}`);
			goto('/organisations');
		} catch (err) {
			console.log(
				`Une erreur est survenue lors de la récupération de l’organisation dont l'id est ${id}`
			);
			console.error(err);
			goto('/organisations');
		}
	}
}
