import { supabasePrivate } from '$lib/utils/Private/supabasePrivate';

export async function insertAccountLog(
	account_id: number,
	message: string,
	details: any,
	from: string
) {
	await supabasePrivate
		.from('nordigen_account_logs')
		.insert({ account_id, message, details, from });
}

export async function insertBankLog(bank_id: number, message: string, details: any, from: string) {
	await supabasePrivate.from('nordigen_bank_logs').insert({ bank_id, message, details, from });
}
