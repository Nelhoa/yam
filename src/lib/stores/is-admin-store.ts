import { supabase } from '$lib/utils/Public/supabaseClient';
import { writable } from 'svelte/store';
import { newAlert } from './alerts-store';

export const isAdmin = writable<boolean>(false);
let isAdminLoaded = false;
let isAdminLoading: Promise<void> | null;

async function isAdminLoader() {
	const { data, error } = await supabase.from('admins').select().maybeSingle();
	if (error) {
		newAlert(error.message);
	} else {
		if (data) isAdmin.set(true);
		isAdminLoaded = true;
	}
}

export async function loadIsAdmin() {
	if (isAdminLoaded) return;
	if (!isAdminLoading) isAdminLoading = isAdminLoader();
}
