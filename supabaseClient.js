import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://duorilnzqwwsadcnvqzg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1b3JpbG56cXd3c2FkY252cXpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAzNDE0NzgsImV4cCI6MjAzNTkxNzQ3OH0.dKr6i7SVGLcou9L4Xe1xOZp-b3UUAXwn5T1IxEprGIw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})