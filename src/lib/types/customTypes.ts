import type { Transaction } from '$lib/models/datas/transaction';
import type dayjs from 'dayjs';
import type { Database } from './supabase';
import type { Scenario } from '$lib/models/scenario/scenario';
import type { NDG_Requisition } from './nordigen';
import type { NordigenAccountInfos } from '$lib/utils/Nordigen/utils/nordigen-client';
import type { SupabaseClient } from '@supabase/supabase-js';

export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

export type DB = Database['public']['Tables'];
export type FUNC = Database['public']['Functions'];
export type CategoryIdentifier = CoreCategoryType | number;
export type CoreCategoryType = 'vatOut' | 'vatIn' | 'otherIncome' | 'otherOutcome';
export const CoreCategoriesList: CoreCategoryType[] = [
	'vatIn',
	'vatOut',
	'otherIncome',
	'otherOutcome'
];

export type supaClient = SupabaseClient<Database>;
export type bankDB = DB['banks'];
export type commitDB = Prettify<
	DB['commits'] & {
		RowAndLink: DB['commits']['Row'] & { transaction_commit: { transaction_id: number }[] };
	}
>;
export type accountDB = DB['accounts'];
export type NordigenBankLogDB = DB['nordigen_bank_logs'];
export type NordigenAccountLogDB = DB['nordigen_account_logs'];

export type enrichedAccounts<T> = {
	account: T;
	todayBalance: number;
	spanStartBalance: number;
};

export type NordigenAccountDB = {
	Row: Prettify<
		Omit<accountDB['Row'], 'info'> & { info: NordigenAccountInfos; provider: 'nordigen' }
	>;
	Insert: Prettify<
		Omit<accountDB['Insert'], 'info'> & { info: NordigenAccountInfos; provider: 'nordigen' }
	>;
	update: Prettify<
		Omit<accountDB['Insert'], 'info'> & { info?: NordigenAccountInfos; provider?: 'nordigen' }
	>;
};

export type NordigenBankDB = {
	Row: Prettify<Omit<bankDB['Row'], 'info'> & { info: NDG_Requisition; provider: 'nordigen' }>;
	Insert: Prettify<
		Omit<bankDB['Insert'], 'info'> & { info: NDG_Requisition; provider: 'nordigen' }
	>;
	update: Prettify<
		Omit<bankDB['Insert'], 'info'> & { info?: NDG_Requisition; provider?: 'nordigen' }
	>;
};

export type ManualBankDB = {
	Row: Prettify<Omit<bankDB['Row'], 'info'> & { info: {}; provider: 'manual' }>;
	Insert: Prettify<Omit<bankDB['Insert'], 'info'> & { info: {}; provider: 'manual' }>;
	update: Prettify<Omit<bankDB['Insert'], 'info'> & { info?: {}; provider?: 'manual' }>;
};

export type ManualAccountDB = {
	Row: Prettify<Omit<accountDB['Row'], 'info'> & { info: {}; provider: 'manual' }>;
	Insert: Prettify<Omit<accountDB['Insert'], 'info'> & { info: {}; provider: 'manual' }>;
	update: Prettify<Omit<accountDB['Insert'], 'info'> & { info?: {}; provider?: 'manual' }>;
};

export type FullManualBank = Prettify<
	ManualBankDB['Row'] & {
		accounts: ManualAccountDB['Row'][];
	}
>;

export type FullNordigenBank = Prettify<
	NordigenBankDB['Row'] & {
		accounts: NordigenAccountDB['Row'][];
	} & { organisation_name: { name: string } }
>;

export type FullBankRow = Prettify<
	bankDB['Row'] & {
		accounts: accountDB['Row'][];
	} & { organisation_name: { name: string } }
>;

export type formulaDB = DB['formulas'];
export type organisationDB = DB['organisations'];

export type scenarioDB = DB['scenarios'];
export type estimatesDB = DB['estimates'];
export type limitsDB = DB['organisations_limits'];
export type transactionDB = DB['transactions'];
export type categoryDB = DB['categories'];
export type transactionsCellsDB = FUNC['get_transactions_cells'];
export type estimateCellsDB = FUNC['get_estimates_cells'];
export type autoEstimateCellsDB = FUNC['get_auto_estimates_cells'];

export type autoEstimatesDB = {
	Row: DB['auto_estimates']['Row'];
	Insert: Omit<DB['auto_estimates']['Row'], 'category' | 'scenario_conflict'>;
	RawInsert: Prettify<
		Omit<DB['auto_estimates']['Row'], 'category' | 'scenario_conflict'> & {
			scenario: Scenario;
		}
	>;
	update: DB['auto_estimates']['Update'];
};

export type TransactionsByMonth = Map<dayjs.Dayjs, Transaction[]>;

export type MonthReference = {
	date: dayjs.Dayjs;
	monthStartAmount: number;
};

export type DateRange = {
	start: dayjs.Dayjs;
	end: dayjs.Dayjs;
};

export type updatePromise<T> = Promise<{ success: boolean; value?: T }>;
export type updateFunction<T> = (value: T) => updatePromise<T>;
