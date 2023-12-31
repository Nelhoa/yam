import type { NDG_AccountDetails, NDG_AccountMeta, NDG_Balances } from '$lib/types/nordigen';
import type dayjs from 'dayjs';
import { getAccessToken } from '../endpoints/access-token-get';
import { getBalances } from '../endpoints/data-balances-get';
import { getDetails } from '../endpoints/data-details-get';
import { getMetadata } from '../endpoints/data-metadata-get';
import { getTransactions } from '../endpoints/data-transactions-get';
import { getInstitutionsList } from '../endpoints/institutions-list-get';
import { createRequisition } from '../endpoints/requisition-create';
import { getRequisition } from '../endpoints/requisition-get';
import { deleteRequisition } from '../endpoints/requisition-delete';
import { getRequisitionsList } from '../endpoints/requisitions-list';

export class NDG_Client {
	private secretId: string;
	private secretKey: string;
	private accessTokenLoader: Promise<void> | null = null;
	private accessToken: {
		access: string;
		access_expires: number;
		refresh: string;
		refresh_expires: number;
	} | null = null;

	constructor(secretId: string, secretKey: string) {
		this.secretId = secretId;
		this.secretKey = secretKey;
	}

	private async init() {
		if (this.accessToken) return;
		if (!this.accessTokenLoader) this.accessTokenLoader = this.initialiser();
		await this.accessTokenLoader;
		this.accessTokenLoader = null;
	}

	private async initialiser() {
		if (this.accessToken) return;
		this.accessToken = await getAccessToken(this.secretId, this.secretKey);
	}

	async getInstitutionsList(countryCode: string) {
		await this.init();
		return await getInstitutionsList(this.accessToken!, countryCode);
	}

	async createRequisition(institution_id: string, max_historical_days = 90) {
		await this.init();
		return await createRequisition(this.accessToken!, institution_id, max_historical_days);
	}

	async getRequisition(init_id: string) {
		await this.init();
		return await getRequisition(this.accessToken!, init_id);
	}

	async getRequisitionsList() {
		await this.init();
		return await getRequisitionsList(this.accessToken!);
	}

	async deleteRequisition(init_id: string) {
		await this.init();
		return await deleteRequisition(this.accessToken!, init_id);
	}

	async getDetails(account_id: string) {
		await this.init();
		return await getDetails(this.accessToken!, account_id);
	}

	async getMetadata(account_id: string) {
		await this.init();
		return await getMetadata(this.accessToken!, account_id);
	}

	async getBalances(account_id: string) {
		await this.init();
		return await getBalances(this.accessToken!, account_id);
	}

	async getTransactions(
		account_id: string,
		options?: { date_from?: dayjs.Dayjs; date_to?: dayjs.Dayjs }
	) {
		await this.init();
		return await getTransactions({
			accessToken: this.accessToken!,
			account_id,
			date_from: options?.date_from,
			date_to: options?.date_to
		});
	}

	async getAccountInfo(account_id: string) {
		const [meta, NDGBalances, details] = await Promise.all([
			this.getMetadata(account_id),
			this.getBalances(account_id),
			this.getDetails(account_id)
		]);
		return { meta, balances: NDGBalances.balances, details } as NordigenAccountInfos;
	}
}

export type NordigenAccountInfos = {
	meta: NDG_AccountMeta;
	balances: NDG_Balances;
	details: NDG_AccountDetails;
};
