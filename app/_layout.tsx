import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Adjust the path as necessary

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // If no session, redirect to login
        router.replace('/login');
      } else if (segments[0] !== '(tabs)') {
        // If logged in and not in the (tabs) group, redirect to home
        router.replace('/(tabs)');
      }
    });

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        router.replace('/(tabs)');
      } else if (event === 'SIGNED_OUT') {
        router.replace('/login');
      }
    });
  }, []);

  return <Slot />;
}