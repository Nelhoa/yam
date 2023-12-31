import type { NordigenBankDB } from '$lib/types/customTypes';
import type { Database } from '$lib/types/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import { nordigen } from '../client';
import type { NDG_Requisition } from '$lib/types/nordigen';

type params = {
	supabaseClient: SupabaseClient<Database>;
	bankId: number;
	requisitionId?: string;
};

/**
 * Get requisition with Nordigen and update it in Database
 */
export async function getAndUpdateRequisition(p: params) {
	let requisitionId = p.requisitionId;
	if (!requisitionId) {
		const { data: bankRow, error: bankerror } = await p.supabaseClient
			.from('banks')
			.select()
			.eq('id', p.bankId)
			.returns<NordigenBankDB['Row'][]>()
			.maybeSingle();
		if (!bankRow || bankerror) throw Error(bankerror?.message ?? 'No bank were found for given id');
		if (!bankRow.info.id) throw Error('No requisition id found for given bank');
		requisitionId = bankRow.info.id;
	}

	let requisition: NDG_Requisition | undefined;
	try {
		requisition = await nordigen.getRequisition(requisitionId);
	} catch (err) {
		console.log(err);
		return null;
	}

	const { error: updateError, count } = await p.supabaseClient
		.from('banks')
		.update({ info: requisition }, { count: 'exact' })
		.eq('id', p.bankId);
	if (updateError || count === 0)
		throw Error(
			updateError?.message ?? 'An error occured while trying to update requisition in database'
		);
	return requisition;
}
