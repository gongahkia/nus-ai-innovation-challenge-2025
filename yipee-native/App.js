import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { AppProvider } from './src/context/AppContext';

export default function App() {
  return (
    <AppProvider>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </AppProvider>
  );
}