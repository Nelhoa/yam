import { newAlert } from '$lib/stores/alerts-store';

type Parameter = {
	success?: string;
	fail?: string;
};

export default function copyToClipBoard(input: string, parameter?: Parameter) {
	let { success, fail } = parameter ? parameter : { success: null, fail: null };
	success = success ? success : 'Copié';
	fail = fail ? fail : 'Échec de la copie';
	try {
		navigator.clipboard.writeText(input);
		newAlert(success);
	} catch (err) {
		newAlert(fail);
	}
}
