import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import SplashScreen from '@/components/SplashScreen'; 

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Simulate loading assets, fonts, etc.
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return <SplashScreen />;
  }

  
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
     
    </Stack>
  );
}