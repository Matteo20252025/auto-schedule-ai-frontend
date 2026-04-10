import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://iwctxcmhtictgansdxlm.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3Y3R4Y21odGljdGdhbnNkeGxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4ODM5NTIsImV4cCI6MjA4NzQ1OTk1Mn0.WH31vbipk0OpLKDOHmlNTjWJhOB5VsMaRd-JZt_5FN4"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)