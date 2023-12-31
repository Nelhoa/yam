export const nordigen_status_list = [
	{
		short: 'CR',
		long: 'Created',
		description: 'Requisition has been successfully created',
		fr: 'La synchronisation a été initiée. Veuillez vous rendre sur le lien d’agrément',
		frLong: 'Créé',
		stage: 1
	},
	{
		short: 'GC',
		long: 'Agreeing',
		description: "End-user is giving consent at Nordigen's consent screen",
		fr: 'Veuillez retourner sur le lien d’agrément pour finaliser la synchronisation du compte',
		frLong: 'En agrément',
		stage: 2
	},
	{
		short: 'UA',
		long: 'Undergoing authentication',
		description: 'End-user is redirected to the financial institution for authentication',
		fr: 'Vous avez donné votre consentement à Nordigen. Veuillez finaliser la connexion à votre banque via le lien d’agrément',
		frLong: 'Authentification',
		stage: 3
	},
	{
		short: 'RJ',
		long: 'Rejected',
		description: 'Either SSN verification has failed or end-user has entered incorrect credentials',
		fr: 'La synchronisation a échouée. Les informations de connexions renseignés sont peut-être mauvais',
		frLong: 'Rejeté',
		stage: 4
	},
	{
		short: 'SA',
		long: 'Selecting accounts',
		description: 'End-user is selecting accounts',
		fr: 'L’utilisateur est entrain de sélectionner des comptes',
		frLong: 'Sélection de comptes',
		stage: 5
	},
	{
		short: 'GA',
		long: 'Granting access',
		description: 'End-user is granting access to their account information',
		fr: 'L’accès est entrain d’être accordé aux informations du compte',
		frLong: 'En cours d’accès',
		stage: 6
	},
	{
		short: 'LN',
		long: 'Linked',
		description: 'Account has been successfully linked to requisition',
		fr: 'La banque a été synchronisé avec succès',
		frLong: 'Synchronisé',
		stage: 7
	},
	{
		short: 'SU',
		long: 'Suspended',
		description:
			'Requisition is suspended due to numerous consecutive errors that happened while accessing its accounts',
		fr: 'La synchronisation est suspendue en raison d’un nombre consécutifs d’erreurs survenues lors de l’accès aux comptes',
		frLong: 'Suspendue',
		stage: 8
	},
	{
		short: 'EX',
		long: 'Expired',
		description: 'Access to accounts has expired as set in End User Agreement',
		fr: 'L’agrément d’accès a expiré',
		frLong: 'Expiré',
		stage: 9
	}
];
