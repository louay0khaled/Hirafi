import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zqufexepwxmfezurkpur.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxdWZleGVwd3htZmV6dXJrcHVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjc5MTUsImV4cCI6MjA3NzYwMzkxNX0.e44fVLPCsg-uD1meh7nAbKDfBqEU-z29ULEerlQr9k8';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);