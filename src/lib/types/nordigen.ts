export enum Transaction_id_type {
	TransactionID = 'TransactionId',
	internalTransactionId = 'InternalTransactionId'
}

export enum NDG_RequisitionStatus {
	CREATED = 'CR', //Requisition has been successfully created
	GIVING_CONSENT = 'GC', //End-user is giving consent at Nordigen's consent screen
	UNDERGOING_AUTHENTICATION = 'UA', //End-user is redirected to the financial institution for authentication
	REJECTED = 'RJ', //Either SSN verification has failed or end-user has entered incorrect credentials
	SELECTING_ACCOUNT = 'SA', //End-user is selecting accounts
	GRANTING_ACCESS = 'GA', //End-user is granting access to their account information
	LINKED = 'LN', //Account has been successfully linked to requisition
	SUSPENDED = 'SU', //Requisition is suspended due to numerous consecutive errors that happened while accessing its accounts
	EXPIRED = 'EX' //Access to accounts has expired as set in End User Agreement
}

export enum NDG_AccountStatus {
	DISCOVERED = 'DISCOVERED', //User has successfully authenticated herself, and account has been discovered
	ERROR = 'ERROR', //An error was encountered when processing account
	EXPIRED = 'EXPIRED', //Access to account has expired as set in End User Agreement
	PROCESSING = 'PROCESSING', //Account is being processed by the institution
	READY = 'READY', //	Account has been successfully processed
	SUSPENDED = 'SUSPENDED' //Account has been suspended (more than 10 consecutive failed attempts to access the account)
}

export type NDG_Error = {
	summary: string;
	detail: string;
	status_code: number;
};

export type NDG_EnrichedAccount = {
	id: string;
	name?: NDG_Account['name'];
	balances: NDG_Balance[];
};

export type NDG_Institution = {
	id: string;
	name: string;
	bic: string;
	transaction_total_days: number;
	countries: string[];
	logo: string;
};

export type NDG_Requisition = {
	id: string;
	reference: string;
	created: string;
	redirect: string;
	status: NDG_RequisitionStatus;
	institution_id: string;
	agreement: string;
	accounts: string[];
	user_language?: string;
	link: string;
	ssn: null | string;
	account_selection: boolean;
	redirect_immediate: boolean;
};

export type NDG_RequisitionStatusInfo = {
	short: string;
	long: string;
	description: string;
	stage: number;
};

export type NDG_AccountMeta = {
	id: string;
	status: NDG_AccountStatus;
	institution_id: string;
	last_accessed?: string;
	created?: string;
	iban?: string;
	owner_name?: string;
};

export type NDG_AccountDetails = {
	account: NDG_Account;
};

export type NDG_Account = {
	currency: string; //Account currency
	bban?: string; //This data element is used for payment accounts which have no IBAN
	bic?: string; //The BIC associated to the account
	cashAccountType?: unknown; //ExternalCashAccountType1Code from ISO 20022
	details?: string; //Specifications that might be provided by the financial institution /characteristics of the account /characteristics of the relevant card
	displayName?: string; //Name of the account as defined by the end user within online channels
	iban?: string;
	linkedAccounts?: string; //This data attribute is a field, where an financial institution can name a cash account associated to pending card transactions.
	msisdn?: string; //An alias to a payment account via a registered mobile phone number
	name?: string; //Name of the account, as assigned by the financial institution
	ownerAddressUnstructured?: string; //Address of the legal account owner
	ownerName?: string; //Name of the legal account owner. If there is more than one owner, then e.g. two names might be noted here. For a corporate account, the corporate name is used for this attribute.
	product?: string; //Product Name of the Bank for this account, proprietary definition
	resourceId?: string; //The account id of the given account in the financial institution
	status?: 'enabled' | 'deleted' | 'blocked'; //Account status. If this field is not used, then the account is available in the sense of this specification.
	usage?: 'PRIV' | 'ORGA'; //Specifies the usage of the account /PRIV: private personal account /ORGA: professional account
};

export type NDG_Balances = NDG_Balance[];

export type NDG_Balance = {
	balanceAmount: NDG_BalanceAmount;
	balanceType: string;
	referenceDate?: string; //indicates the date of the balance
	creditLimitIncluded?: boolean; //A flag indicating if the credit limit of the corresponding account is included in the calculation of the balance, where applicable.
	lastChangeDateTime?: string; //This data element might be used to indicate e.g. with the expected or booked balance that no action is known on the account, which is not yet booked.
	lastCommittedTransaction?: string; //entryReference of the last commited transaction to support the TPP in identifying whether all end users transactions are already known.
};

export type NDG_BalanceAmount = {
	amount: number;
	currency: string;
};

export type NDG_Transactions = {
	booked: NDG_Transaction[];
	pending: NDG_Transaction[];
};

export type NDG_Transaction = {
	//Required key
	transactionAmount: {
		currency: string;
		amount: number;
	};

	//ID keys
	transactionId?: string; //Unique transaction identifier given by financial institution
	internalTransactionId?: string; //Transaction identifier given by Nordigen
	mandateId?: string; //Identification of Mandates, e.g. a SEPA Mandate ID
	checkId?: string; //Identification of a Cheque
	entryReference?: string; //Is the identification of the transaction as used for reference given by financial institution.

	//Date keys
	bookingDate?: string; //The date when an entry is posted to an account on the financial institutions books.
	bookingDateTime?: string; //The date and time when an entry is posted to an account on the financial institutions books.
	valueDate?: string; //The Date at which assets become available to the account owner in case of a credit
	valueDateTime?: string; //The date and time at which assets become available to the account owner in case of a credit
	endToEndId?: string; //Unique end to end ID

	//Transactions informations
	remittanceInformationUnstructured?: string;
	remittanceInformationUnstructuredArray?: string[];
	remittanceInformationStructured?: string; //Reference as contained in the structured remittance reference structure
	remittanceInformationStructuredArray?: string[];
	additionalInformation?: string; //Might be used by the financial institution to transport additional transaction related information
	additionalInformationStructured?: string; //Is used if and only if the bookingStatus entry equals "information"
	bankTransactionCode?:
		| 'PMNT-ICDT-STDO'
		| 'PMNT-IRCT-STDO'
		| 'PMNT-ICDT-XBST'
		| 'PMNT-IRCT-XBST'
		| 'PMNT-MCOP-OTHR'; //Bank transaction code as used by the financial institution and using the sub elements of this structured code defined by ISO20022.
	currencyExchange?: unknown[]; //TYPE NOT SURE : Array of Report Exchange Rate
	merchantCategoryCode?: string; //Merchant category code as defined by card issuer
	purposeCode?: unknown;

	//Bank Informations
	proprietaryBankTransactionCode?: string; //Proprietary bank transaction code as used within a community or within an financial institution
	balanceAfterTransaction?: NDG_Balance; //This is the balance after this transaction. Recommended balance type is interimBooked.

	//Creditor
	creditorName?: string; //Name of the creditor if a "Debited" transaction
	creditorAccount?: string; //TYPE NOT SURE: Account Reference
	creditorAgent?: string; //TYPE NOT SURE : BICFI
	creditorId?: string; //Identification of Creditors, e.g. a SEPA Creditor ID
	ultimateCreditor?: string;

	//Debtor
	debtorName?: string; //Name of the debtor if a "Credited" transaction
	debtorAgent?: unknown; //NOT SURE : BICFI
	ultimateDebtor?: string;
	debtorAccount?: {
		iban: string;
	};
};
