import type { Repository } from '../types';
import { LocalStorageRepo } from './LocalStorageRepo';
import { SupabaseRepo } from './SupabaseRepo';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use Supabase when env vars are present; otherwise fall back to LocalStorage.
export const repository: Repository =
  supabaseUrl && supabaseKey ? SupabaseRepo : LocalStorageRepo;

export { LocalStorageRepo, SupabaseRepo };
