import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_KEY } from '$env/static/private';
import type { Database } from '$lib/types/supabase';

const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabasePrivateKey = SUPABASE_KEY;

export const supabasePrivate = createClient<Database>(supabaseUrl, supabasePrivateKey);

export async function newCustomLog(log: Database['public']['Tables']['custom_logs']['Insert']) {
	await supabasePrivate.from('custom_logs').insert(log);
}
