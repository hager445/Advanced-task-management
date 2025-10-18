import { createClient } from '@supabase/supabase-js'
export const tokenName = 'sb-anzklythyjubzjgcqewl-auth-token';
const supabaseUrl = 'https://anzklythyjubzjgcqewl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuemtseXRoeWp1YnpqZ2NxZXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNTc2NTksImV4cCI6MjA2MDYzMzY1OX0.7zw0hwqj3kSJIy8bsOHT2WlxKy9BllzRXDkL0OCRKdw';
export const supabase = createClient(supabaseUrl, supabaseKey)