import {
	ProtoTransaction,
	ProtoTransactionsRowSchema,
	type protoTransactionRow
} from '$lib/models/proto-transaction/proto-transaction';
import type { ProtoTransactionManager } from '$lib/models/proto-transaction/proto-transaction-manager';
import { parseNumber } from '$lib/utils/Public/Helpers/parseNumber';

export function createProtoTransactionFromCSV(data: unknown, manager: ProtoTransactionManager) {
	const { protoTransactionsRows, errors } = parseData(data);
	if (!protoTransactionsRows) return { error: 'Aucune transaction n’a pu être trouvée' };

	const protoTransactions = protoTransactionsRows.map((row) => new ProtoTransaction(manager, row));
	let error = null;
	if (errors.length > 0) {
		console.log({ parseErrors: errors });
		error = `Certaines transactions n’ont pas pu être importées pour cause de format invalide (${errors.length} ligne·s)`;
	}
	return { protoTransactions, error };
}

function parseData(data: unknown) {
	if (!Array.isArray(data)) return { protoTransactionsRows: undefined, errors: ['No array found'] };
	const protoTransactionsRows: protoTransactionRow[] = [];
	const errors: any[] = [];
	for (let item of data) {
		try {
			if ('amount' in item && item.amount) item.amount = parseNumber(item.amount);
			const parsedRow = ProtoTransactionsRowSchema.parse(item);
			protoTransactionsRows.push(parsedRow);
		} catch (err) {
			errors.push(err);
		}
	}
	return { protoTransactionsRows, errors };
}
