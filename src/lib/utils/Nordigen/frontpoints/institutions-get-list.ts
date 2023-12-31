import { newAlert } from '$lib/stores/alerts-store';
import type { NDG_Institution } from '$lib/types/nordigen';

/**
 * Get institution list trought Nordigen API
 */
export const getInstitutionsList = async (countryCode: string): Promise<NDG_Institution[]> => {
	const response = await fetch(`/api/nordigen/getInstitutionsList?country_code=${countryCode}`, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			authMode: 'session'
		}
	});
	const { institutions, message } = await response.json();
	newAlert(message);

	return institutions;
};
