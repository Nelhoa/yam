import { newAlert } from '$lib/stores/alerts-store';

/**
 * If account_id is null, refresh all accounts
 */
export const refreshAccounts = async (
	{ uuid }: object & { uuid: string | null } = { uuid: null }
) => {
	const response = await fetch('/api/nordigen/refreshAccounts', {
		method: 'POST',
		body: JSON.stringify({
			bank_account_uuid: uuid
		}),
		headers: {
			'content-type': 'application/json',
			authMode: 'session'
		}
	});
	const { message } = await response.json();
	if (message) newAlert(message);
};
