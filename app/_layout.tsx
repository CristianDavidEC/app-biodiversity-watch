import AuthProvider from '@/providers/AuthProvider';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import '../global.css';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <SafeAreaView className="flex-1 bg-black" edges={['left', 'right', 'bottom']} >
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen name="observations/[id]" options={{ title: 'Observación', headerStyle: { backgroundColor: '#111' }, headerTitleStyle: { fontSize: 16, fontWeight: 'bold' } }} />
            <Stack.Screen name="observations/SpeciesDetails" options={{ title: 'Especie' }} />
            <Stack.Screen name="ObservationForm" options={{ title: 'Creación de Observación' }} />
            <Stack.Screen name="(auth)/login" options={{ title: 'Iniciar Sesión' }} />
            <Stack.Screen name="(auth)/forgot-password" options={{ title: 'Recuperar Contraseña' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaView>
    </AuthProvider>
  );
}
