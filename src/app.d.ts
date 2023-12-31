// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { Database } from '$lib/types/supabase';
import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import type { intros } from 'svelte/internal';

// and what to do when importing types

declare global {
	declare namespace App {
		interface Supabase {
			Database: import('$lib/types/supabase').Database;
			SchemaName: 'public';
		}
		// interface Error {}
		interface Locals {
			sb: SupabaseClient<Database>;
			profile: Database['public']['Tables']['profiles']['Row'] | null | undefined;
			getSession: () => Promise<Session | null>;
			localisation: {
				ip: string;
				country_code2: string;
				country_name: string;
				is_eu: boolean;
				languages: string;
				hostname: string;
				country_capital: string;
				city: string;
				zipcode: string;
				country_flag: string;
			} | null;
		}

		interface PageData {
			session: import('@supabase/supabase-js').Session | null;
			sb?: TypedSupabaseClient;
		}

		// interface Platform {}
	}
}
