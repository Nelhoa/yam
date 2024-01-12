import type dayjs from 'dayjs';
import type { Database } from './supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

export type DB = Database['public']['Tables'];
export type FUNC = Database['public']['Functions'];
export type supaClient = SupabaseClient<Database>;

export type DateRange = {
	start: dayjs.Dayjs;
	end: dayjs.Dayjs;
};

export type updatePromise<T> = Promise<{ success: boolean; value?: T }>;
export type updateFunction<T> = (value: T) => updatePromise<T>;
