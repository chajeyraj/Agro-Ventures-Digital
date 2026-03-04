import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Auth } from './screens/Auth';
import { Home } from './screens/Home';
import { AddExpense } from './screens/AddExpense';
import { SupabaseSetup } from './components/SupabaseSetup';
import { COLORS } from './theme';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator id="root" screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Auth" component={Auth} />
      ) : (
        <>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="AddExpense" component={AddExpense} />
        </>
      )}
    </Stack.Navigator>
  );
};

const hasSupabaseKeys = 
  process.env.EXPO_PUBLIC_SUPABASE_URL && 
  process.env.EXPO_PUBLIC_SUPABASE_URL !== 'https://your-project-id.supabase.co' &&
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY !== 'your-anon-key';

export default function App() {
  if (!hasSupabaseKeys) {
    return <SupabaseSetup />;
  }

  return (
    <View style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      </AuthProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
