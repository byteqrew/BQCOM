import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { EmailAuthScreen } from '../screens/auth/EmailAuthScreen';
import { OtpScreen } from '../screens/auth/OtpScreen';
import { OnboardingScreen } from '../screens/auth/OnboardingScreen';

export type AuthStackParamList = {
  Welcome: undefined;
  EmailAuth: undefined;
  Otp: { email: string };
  Onboarding: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="EmailAuth" component={EmailAuthScreen} />
      <Stack.Screen name="Otp" component={OtpScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    </Stack.Navigator>
  );
}
