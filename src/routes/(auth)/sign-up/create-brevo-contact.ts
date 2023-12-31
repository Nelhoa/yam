import { BREVO_API_KEY } from '$env/static/private';

const url = 'https://api.brevo.com/v3/contacts';

type BrevoContact = {
	email: string;
	phone: string;
	firstName: string;
	lastName: string;
};

export async function createBrevoContact(contact: BrevoContact) {
	const data = {
		email: contact.email,
		attributes: {
			PRENOM: contact.firstName,
			NOM: contact.lastName
		},
		listIds: [7],
		emailBlacklisted: false,
		smsBlacklisted: false,
		updateEnabled: true
	};

	let id: string | undefined;

	try {
		const res = await fetch(`${url}`, {
			method: 'POST',
			headers: {
				'api-key': BREVO_API_KEY,
				'Content-Type': 'application/json',
				accept: 'application/json'
			},
			body: JSON.stringify(data)
		});

		const response = await res.json();
		if (typeof response.id !== 'number') throw response;
		id = String(response.id);
	} catch (error) {
		console.log('ERREUR BREVO');
		console.log(error);
	}
	return id;
}
