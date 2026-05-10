import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { DiscoverScreen } from '../screens/home/DiscoverScreen';
import { MatchesScreen } from '../screens/matches/MatchesScreen';
import { ChatScreen } from '../screens/chat/ChatScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { COLORS } from '../constants';

export type MainTabParamList = {
  Discover: undefined;
  Matches: undefined;
  Chat: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const icon = (label: string) => ({ focused }: { focused: boolean }) => (
  <Text style={{ fontSize: 22 }}>
    {label === 'Discover' ? '🔍' : label === 'Matches' ? '💛' : label === 'Chat' ? '💬' : '👤'}
  </Text>
);

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen name="Discover" component={DiscoverScreen} options={{ tabBarIcon: icon('Discover') }} />
      <Tab.Screen name="Matches" component={MatchesScreen} options={{ tabBarIcon: icon('Matches') }} />
      <Tab.Screen name="Chat" component={ChatScreen} options={{ tabBarIcon: icon('Chat') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: icon('Profile') }} />
    </Tab.Navigator>
  );
}
