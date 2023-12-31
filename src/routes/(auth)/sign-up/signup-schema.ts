import { countryCode } from '$lib/utils/Public/everyCountryCode';
import { z } from 'zod';

const countryNames = countryCode.reduce(
	(previous, current) => [...previous, current.Country],
	[] as string[]
) as [string, ...string[]];

export const signupSchema = z.object({
	firstName: z.string().min(2, 'Entrez un prénom d’au moins deux lettres'),
	lastName: z.string().min(2, 'Entrez un nom d’au moins deux lettres'),
	company: z.string().min(2, 'Entrez un nom d’entreprise d’au moins deux lettres'),
	email: z.string().email('Email invalide'),
	phone: z.string(),
	termsConsent: z.literal<boolean>(true),
	country: z.enum(countryNames),
	countryCode: z.string()
});
