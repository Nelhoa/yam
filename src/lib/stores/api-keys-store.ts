import { writable, get } from 'svelte/store';
import { supabase } from '$lib/utils/Public/supabaseClient';
import type { Database } from '$lib/types/supabase';
import { newAlert } from '$lib/stores/alerts-store';

export const apiKeys = writable([] as Database['public']['Tables']['api_access_keys']['Row'][]);

export async function loadApiKeys() {
	const { error, data } = await supabase.from('api_access_keys').select();
	if (error) newAlert(error.message);
	if (data) apiKeys.set(data);
}

export async function newApiKey(keyName: string) {
	if (keyName && keyName.length > 2) {
		const { error } = await supabase.from('api_access_keys').insert({ name: keyName });
		if (error) {
			newAlert(error.message);
			return false;
		}
		loadApiKeys();
		return true;
	} else {
		newAlert('API Key name must contain at least 5 letters');
		return false;
	}
}

export async function deleteApiKey(key_id: string, key_name: string) {
	if (window.confirm(`Are you sure you want to delete ${key_name} ?`)) {
		const { error } = await supabase.from('api_access_keys').delete().eq('id', key_id);
		if (error) {
			newAlert(error.message);
			return false;
		}
		apiKeys.update((n) => n.filter((cur) => cur.id !== key_id));
		return true;
	}
}
