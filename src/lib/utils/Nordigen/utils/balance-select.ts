import type { NDG_Balance, NDG_Balances } from '$lib/types/nordigen';

/**
 * Choose the most relevant Nordigen balance
 */
export function selectBalance(balances: NDG_Balances): NDG_Balance {
	if (balances.length < 1)
		throw Error('Given Nordigen account has no balance. Impossible to get the most relevant one.');
	const balancePriority = [
		'closingBooked',
		'interimAvailable',
		'interimBooked',
		'expected',
		'openingBooked',
		'forwardAvailable'
	];

	let mostRelevantBalance: NDG_Balance | undefined;
	let highestPriority = balancePriority.length;

	for (const balance of balances) {
		const balanceIndex = balancePriority.indexOf(balance.balanceType);

		if (balanceIndex >= 0 && balanceIndex < highestPriority) {
			highestPriority = balanceIndex;
			mostRelevantBalance = balance;
		}
	}

	if (mostRelevantBalance) return mostRelevantBalance;

	// Si aucune des balances prioritaires n'est disponible, choisissez la balance avec la date de référence la plus récente
	mostRelevantBalance = balances.reduce((latestBalance, currentBalance) => {
		const latestDate = latestBalance.referenceDate
			? new Date(latestBalance.referenceDate)
			: new Date(0);
		const currentDate = currentBalance.referenceDate
			? new Date(currentBalance.referenceDate)
			: new Date(0);

		return currentDate > latestDate ? currentBalance : latestBalance;
	});

	return mostRelevantBalance;
}
