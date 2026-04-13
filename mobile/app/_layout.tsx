/**
 * Root layout — bootstraps the backend health check before rendering tabs.
 *
 * Shows a startup screen while polling /health.  Once the backend responds,
 * sets backendReady=true in the store and renders the normal tab layout.
 */
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../constants/colors';
import { waitForBackend } from '../hooks/useApi';
import { useStore } from '../store';

export default function RootLayout() {
  const backendReady = useStore((s) => s.backendReady);
  const setBackendReady = useStore((s) => s.setBackendReady);
  const [startupError, setStartupError] = useState<string | null>(null);

  useEffect(() => {
    waitForBackend()
      .then(() => setBackendReady(true))
      .catch((e) => setStartupError(e.message ?? 'Backend failed to start'));
  }, [setBackendReady]);

  if (startupError) {
    return (
      <View style={styles.startup}>
        <Text style={styles.errorTitle}>Backend Error</Text>
        <Text style={styles.errorMsg}>{startupError}</Text>
      </View>
    );
  }

  if (!backendReady) {
    return (
      <View style={styles.startup}>
        <Text style={styles.startupTitle}>PYFA Mobile</Text>
        <ActivityIndicator color={Colors.gold} size="large" style={{ marginTop: 32 }} />
        <Text style={styles.startupSub}>Starting fitting engine…</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.header },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: Colors.bg },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="fitting/[id]"
          options={{ title: 'Fitting', presentation: 'card' }}
        />
        <Stack.Screen
          name="ship-picker/index"
          options={{ title: 'Select Ship', presentation: 'modal' }}
        />
        <Stack.Screen
          name="market-picker/index"
          options={{ title: 'Add Module', presentation: 'modal' }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  startup: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  startupTitle: {
    color: Colors.gold,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 2,
  },
  startupSub: {
    color: Colors.textMuted,
    fontSize: 14,
    marginTop: 8,
  },
  errorTitle: {
    color: Colors.danger,
    fontSize: 20,
    fontWeight: '700',
  },
  errorMsg: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});
