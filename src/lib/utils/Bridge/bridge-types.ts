export type bridgeError = { type: string; message: string; documentation_url?: string };
export type bridgeBankCapabilities =
	| 'ais'
	| 'account_check'
	| 'single_transfer'
	| 'bulk_transfer'
	| 'single_payment'
	| 'single_payment_scheduled'
	| 'bulk_payment'
	| 'bulk_payment_scheduled';

export type BridgeTransaction = {
	id: number;
	clean_description: string;
	bank_description: string;
	amount: number;
	date: string;
	updated_at: string;
	currency_code: string;
	is_deleted: boolean;
	category_id: number;
	account_id: number;
	is_future: boolean;
	show_client_side: boolean;
};

export type BridgeAccount = {
	id: number;
	name: string;
	balance: number;
	status: number;
	status_code_info: string | null;
	status_code_description: string | null;
	updated_at: string;
	type: BridgeAccountType;
	currency_code: string;
	item_id: number;
	bank_id: number;
	loan_details?: {
		next_payment_date: string;
		next_payment_amount: number;
		maturity_date: string;
		opening_date: string;
		interest_rate: number;
		type: string;
		borrowed_capital: number;
		repaid_capital: number;
		remaining_capital: number;
	};
	savings_details?: {
		opening_date: string;
		interest_rate: number;
		ceiling: number;
	};
	is_pro: boolean;
	iban: string;
};

export type BridgeAccountType =
	| 'checking'
	| 'savings'
	| 'brokerage'
	| 'card'
	| 'loan'
	| 'shared_saving_plan'
	| 'pending'
	| 'life_insurance'
	| 'special'
	| 'unknown';
