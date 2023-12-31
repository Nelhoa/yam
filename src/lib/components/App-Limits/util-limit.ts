import { PUBLIC_SITE_TITLE } from '$env/static/public';
import { EventBankData } from '$lib/Events/bank-data-events';

export const limitMessages = {
	default: 'Vous avez atteint les limites de votre organisation. Passez au plan supérieur.',
	bank: 'Passez au plan supérieur pour ajouter plus de banques synchronisées !',
	account: 'Passez au plan supérieur pour ajouter plus de comptes bancaires synchronisés !',
	manualAccount: 'Passez au plan supérieur pour ajouter plus de comptes manuels !',
	addFormula: 'Passez au plan supérieur pour pouvoir ajouter des formules !',
	runFormula: 'Passez au plan supérieur pour pouvoir recalculer les formules !',
	addScenario: 'Passez au plan supérieur pour pouvoir ajouter des scénarios supplémentaires !',
	trialEndDate: `Passez au plan supérieur pour profiter sans limite de temps des fonctionnalités de ${PUBLIC_SITE_TITLE}`,
	trialHasEnded: `Souscrivez à l’un de nos plans pour continuer à utiliser ${PUBLIC_SITE_TITLE} à son plein potentiel !`,
	manualAccountOverLimit: `Impossible de modifier le compte ! Votre organisation dépasse sa limite de comptes manuels.`,
	accountOverLimit: `Impossible de modifier le compte ! Votre organisation dépasse sa limite de comptes bancaires.`,
	bankOverLimit: `Impossible de modifier le compte ! Votre organisation dépasse sa limite de banques synchronisées.`
};

export type limitMessageKey = keyof typeof limitMessages;

export function openLimitMenu(key: limitMessageKey) {
	EventBankData.dispatch('OverLimit', key);
}
