import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase project credentials
const SUPABASE_URL = 'https://zzpzrkorficygedsftxt.supabase.co';


const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6cHpya29yZmljeWdlZHNmdHh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyMzMxNjMsImV4cCI6MjA1MDgwOTE2M30.qMUYG6P_6cnwNF1KKrt2nHPwoSA3ialRUHHTtsaKkFw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
