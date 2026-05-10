import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  TextInput, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { supabase } from '../../services/supabase';
import { COLORS } from '../../constants';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'EmailAuth'>;
};

export function EmailAuthScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed.includes('@') || !trimmed.includes('.')) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: { shouldCreateUser: true },
    });
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    navigation.navigate('Otp', { email: trimmed });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Enter your email</Text>
        <Text style={styles.subtitle}>We'll send a 6-digit code to verify your email address</Text>

        <TextInput
          style={styles.input}
          placeholder="yourname@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
          placeholderTextColor={COLORS.textSecondary}
        />

        <TouchableOpacity
          style={[styles.button, (!email || loading) && styles.buttonDisabled]}
          onPress={handleSendOtp}
          disabled={!email || loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Send Code'}</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  inner: { flex: 1, padding: 24, gap: 16 },
  back: { marginBottom: 8 },
  backText: { color: COLORS.primary, fontSize: 16 },
  title: { fontSize: 26, fontWeight: '700', color: COLORS.text },
  subtitle: { fontSize: 15, color: COLORS.textSecondary, lineHeight: 22 },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 18,
    color: COLORS.text,
    marginTop: 8,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
