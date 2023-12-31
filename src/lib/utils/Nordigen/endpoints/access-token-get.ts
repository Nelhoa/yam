import { NordigenURL } from './url';

export type AccessToken = {
	access: string;
	access_expires: number;
	refresh: string;
	refresh_expires: number;
};

export async function getAccessToken(secretId: string, secretKey: string) {
	const res_accessToken = await fetch(`${NordigenURL}/api/v2/token/new/`, {
		method: 'POST',
		headers: {
			accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			secret_id: secretId,
			secret_key: secretKey
		})
	});
	const res = await res_accessToken.json();
	if (res.status_code) throw res;
	return res as AccessToken;
}
