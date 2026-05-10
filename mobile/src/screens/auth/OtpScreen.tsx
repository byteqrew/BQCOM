import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  TextInput, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { supabase } from '../../services/supabase';
import { COLORS } from '../../constants';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Otp'>;
  route: RouteProp<AuthStackParamList, 'Otp'>;
};

export function OtpScreen({ navigation, route }: Props) {
  const { email } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    const updated = [...otp];
    updated[index] = text;
    setOtp(updated);
    if (text && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) return;

    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    });
    setLoading(false);

    if (error) {
      Alert.alert('Invalid code', 'Please check the code and try again.');
      return;
    }
    // RootNavigator picks up the new session automatically
  };

  const handleResend = async () => {
    await supabase.auth.signInWithOtp({ email });
    Alert.alert('Code sent', 'A new code has been sent to your email.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.subtitle}>We sent a 6-digit code to{'\n'}{email}</Text>

        <View style={styles.otpRow}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={(r) => { if (r) inputs.current[i] = r; }}
              style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
              value={digit}
              onChangeText={(t) => handleChange(t.slice(-1), i)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, (otp.join('').length < 6 || loading) && styles.buttonDisabled]}
          onPress={handleVerify}
          disabled={otp.join('').length < 6 || loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Verifying...' : 'Verify'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResend} style={styles.resend}>
          <Text style={styles.resendText}>Didn't get a code? Resend</Text>
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
  subtitle: { fontSize: 15, color: COLORS.textSecondary, lineHeight: 24 },
  otpRow: { flexDirection: 'row', gap: 10, justifyContent: 'center', marginTop: 8 },
  otpBox: {
    width: 48,
    height: 58,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 10,
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  otpBoxFilled: { borderColor: COLORS.primary },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  resend: { alignItems: 'center' },
  resendText: { color: COLORS.primary, fontSize: 15 },
});
