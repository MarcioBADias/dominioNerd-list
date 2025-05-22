import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hkwvjcqzekepohvhgbfk.supabase.co'
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhrd3ZqY3F6ZWtlcG9odmhnYmZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODEzMDksImV4cCI6MjA2MzQ1NzMwOX0.Ox_s5W2wRRhQ5VxDvSZRx9LKBNJFAlFWjrY1bRAPL9I'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export { supabase }
