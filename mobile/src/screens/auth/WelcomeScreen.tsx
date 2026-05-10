import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { COLORS, APP_NAME } from '../../constants';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;
};


export function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.appName}>{APP_NAME}</Text>
        <Text style={styles.tagline}>Find your perfect match in the Indian community across America</Text>
        <Text style={styles.subTagline}>🪷 Trusted by thousands of Indian families</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('EmailAuth')}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>

        <Text style={styles.terms}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'space-between',
    padding: 24,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 18,
    color: COLORS.text,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 26,
    paddingHorizontal: 16,
  },
  subTagline: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  actions: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  terms: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
