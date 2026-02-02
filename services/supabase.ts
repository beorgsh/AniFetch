import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vpxvccfzlqxuwzxednfg.supabase.co';
const supabaseKey = 'sb_publishable_U2ruy8Ys7T3eRUMEHU6rrQ_awpXMNIK';

export const supabase = createClient(supabaseUrl, supabaseKey);