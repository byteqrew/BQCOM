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
  navigation: NativeStackNavigationProp<AuthStackParamList, 'PhoneAuth'>;
};

export function PhoneAuthScreen({ navigation }: Props) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      Alert.alert('Invalid number', 'Enter a valid 10-digit US phone number.');
      return;
    }

    const fullPhone = `+1${cleaned}`;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    navigation.navigate('Otp', { phone: fullPhone });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Enter your phone number</Text>
        <Text style={styles.subtitle}>We'll send a one-time code to verify your number</Text>

        <View style={styles.phoneRow}>
          <View style={styles.countryCode}>
            <Text style={styles.countryCodeText}>🇺🇸 +1</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="(555) 000-0000"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            maxLength={14}
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, (!phone || loading) && styles.buttonDisabled]}
          onPress={handleSendOtp}
          disabled={!phone || loading}
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
  phoneRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  countryCode: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  countryCodeText: { fontSize: 16, color: COLORS.text },
  input: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 18,
    color: COLORS.text,
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
