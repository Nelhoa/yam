import { newAlert } from '$lib/stores/alerts-store';

/**
 * Query account database and all usual Nordigen functions.
 * Return all results and eventual errors in promise
 */
export const testAccount = async (account_id: number) => {
	const response = await fetch('/api/nordigen/testNordigen', {
		method: 'POST',
		body: JSON.stringify({ account_id }),
		headers: {
			'content-type': 'application/json',
			Accept: 'application/json',
			authMode: 'session'
		}
	});
	const res = await response.json();
	newAlert(res.message);
	return res;
};
