import { BRIDGE_CLIENT_ID, BRIDGE_CLIENT_SECRET } from '$env/static/private';
import type { bridgeBankCapabilities } from '../bridge-types';

type params = {
	bankId: number;
};

type res_getBank = {
	id: number;
	name: string;
	parent_name: string;
	country_code: string;
	primary_color: string | null;
	secondary_color: string | null;
	logo_url: string;
	form: {
		label: string;
		type: 'USER' | 'PWD' | 'PWD2';
		isNum: string;
		maxLength: number | null;
	}[];
	authentication_type: string;
	capabilities: bridgeBankCapabilities[];
	transfer: {
		nb_max_transactions: number;
		max_size_label: number;
		multiple_dates_transfers: boolean;
	};
	payment: {
		nb_max_transactions: number;
		max_size_label: number;
		multiple_dates_payments: boolean;
		sender_iban_available: boolean;
	};
	channel_type: string[];
};

export async function getBank(p: params) {
	const response = await fetch(`https://api.bridgeapi.io/v2/banks/${p.bankId}`, {
		method: 'GET',
		headers: {
			'Bridge-Version': '2021-06-01',
			'Content-Type': 'application/json',
			'Client-Id': BRIDGE_CLIENT_ID,
			'Client-Secret': BRIDGE_CLIENT_SECRET
		}
	});
	const data = await response.json();
	if (data?.type) throw Error(data.message);
	return data as res_getBank;
}
