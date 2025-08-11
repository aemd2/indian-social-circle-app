import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { UserFlowProvider } from './src/contexts/UserFlowContext';
import { initializeWebConfig } from './src/utils/webConfig';

// Initialize web configuration to suppress deprecation warnings
initializeWebConfig();

// Main App Component with full navigation structure and user flow management
export default function App() {
  return (
    <UserFlowProvider>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </SafeAreaProvider>
    </UserFlowProvider>
  );
}