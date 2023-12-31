import type { Database } from '$lib/types/supabase';

export function isSignedUp(profile?: Database['public']['Tables']['profiles']['Row'] | null) {
	if (!profile) return false;
	if (
		!profile.first_name ||
		!profile.last_name ||
		!profile.phone ||
		!profile.company ||
		!profile.email ||
		!profile.country ||
		!profile.last_terms_accepted
	)
		return false;
	return true;
}
