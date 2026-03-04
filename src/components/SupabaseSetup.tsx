import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, ScrollView, Platform } from 'react-native';
import { AlertCircle, ExternalLink } from 'lucide-react-native';
import { GlassCard } from './GlassCard';
import { COLORS } from '../theme';
import { Layout } from './Layout';

export const SupabaseSetup: React.FC = () => {
  const openDashboard = () => {
    Linking.openURL('https://supabase.com/dashboard');
  };

  return (
    <Layout scrollable={true}>
      <View style={styles.container}>
        <GlassCard style={styles.card}>
          <View style={styles.iconContainer}>
            <AlertCircle color="#fff" size={32} />
          </View>
          <Text style={styles.title}>Setup Required</Text>
          <Text style={styles.subtitle}>
            Connect your Supabase project to activate the tracker.
          </Text>
          
          <ScrollView style={styles.stepsContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.step}>
              <Text style={styles.stepTitle}>1. Create Tables</Text>
              <Text style={styles.stepText}>
                Run the SQL query provided in the documentation to create the expenses and categories tables.
              </Text>
            </View>
            
            <View style={styles.step}>
              <Text style={styles.stepTitle}>2. Environment Variables</Text>
              <Text style={styles.stepText}>Add your credentials to the environment:</Text>
              <View style={styles.monoBox}>
                <Text style={styles.monoText}>EXPO_PUBLIC_SUPABASE_URL</Text>
                <Text style={styles.monoText}>EXPO_PUBLIC_SUPABASE_ANON_KEY</Text>
              </View>
            </View>

            <View style={styles.step}>
              <Text style={styles.stepTitle}>3. Disable Confirmation</Text>
              <Text style={styles.stepText}>
                Go to Auth {'>'} Providers {'>'} Email and disable "Confirm Email" for testing.
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity 
            onPress={openDashboard}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Supabase Dashboard</Text>
            <ExternalLink size={16} color="#fff" />
          </TouchableOpacity>
        </GlassCard>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    padding: 24,
    maxHeight: '90%',
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 24,
    lineHeight: 16,
  },
  stepsContainer: {
    marginBottom: 24,
  },
  step: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 12,
  },
  stepTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  stepText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.4)',
    lineHeight: 14,
  },
  monoBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  monoText: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  button: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
