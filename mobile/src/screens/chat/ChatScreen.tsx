import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS } from '../../constants';

export function ChatScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>
      <View style={styles.placeholder}>
        <Text style={styles.icon}>💬</Text>
        <Text style={styles.title}>Messages coming soon</Text>
        <Text style={styles.subtitle}>Connect with your matches and start a conversation</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 8 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: COLORS.text },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, paddingHorizontal: 32 },
  icon: { fontSize: 48 },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  subtitle: { fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22 },
});
