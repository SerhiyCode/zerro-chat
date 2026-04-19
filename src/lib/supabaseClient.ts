import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://ddeoymmeladsvlvifqad.supabase.co';
const supabaseAnonKey = 'sb_publishable_tpCVTu1b96H3DkJrDQHacg_7txpZ6HO';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 
