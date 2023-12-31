import { Transaction_id_type, type NDG_Transaction } from '$lib/types/nordigen';
import type { Database } from '$lib/types/supabase';

export let structureNordigenTransactions = (
	raw_transactions: NDG_Transaction[],
	id: number,
	bank_account_uuid: string,
	id_type: string
) => {
	try {
		let restructuredTransactions: Omit<
			Database['public']['Tables']['transactions']['Insert'],
			'created_at' | 'id'
		>[] = [];

		for (const transaction of raw_transactions) {
			const transaction_id =
				id_type === Transaction_id_type.TransactionID
					? transaction.transactionId
					: id_type === Transaction_id_type.internalTransactionId
					? transaction.internalTransactionId
					: null;

			if (!transaction_id) throw Error('No transaction ID found');

			transaction.transactionId ? transaction.transactionId : transaction.internalTransactionId;
			let informations: string = [
				transaction.remittanceInformationUnstructuredArray?.join(' '),
				transaction.remittanceInformationUnstructured,
				transaction.additionalInformation,
				transaction.additionalInformationStructured,
				transaction.remittanceInformationStructured,
				transaction.remittanceInformationStructuredArray?.join(''),
				transaction.creditorName,
				transaction.debtorName
			]
				.filter((cur) => cur)
				.join(' ');

			restructuredTransactions = [
				...restructuredTransactions,
				{
					booking_date: transaction.bookingDate
						? (new Date(transaction.bookingDate) as unknown as string)
						: null,
					value_date: transaction.valueDate
						? (new Date(transaction.valueDate) as unknown as string)
						: null,
					amount: Number(transaction.transactionAmount.amount),
					transaction_id,
					unique_id: id + '_' + transaction_id,
					informations,
					bank_account_uuid
				}
			];
		}

		return restructuredTransactions;
	} catch (err) {
		throw {
			message: `Error while structuring transactions. Please contact our support and give this ID as reference : ${id}`,
			bank_account_id: id,
			details: err
		};
	}
};
