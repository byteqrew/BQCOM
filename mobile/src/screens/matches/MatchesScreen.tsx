import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, FlatList,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { supabase } from '../../services/supabase';
import { useAuthStore } from '../../store/authStore';
import { Match, UserProfile } from '../../types';
import { COLORS } from '../../constants';

interface MatchWithProfile extends Match {
  otherProfile?: UserProfile;
}

export function MatchesScreen() {
  const { user } = useAuthStore();
  const [matches, setMatches] = useState<MatchWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    if (!user) return;
    setLoading(true);

    const { data } = await supabase
      .from('matches')
      .select('*')
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .order('matched_at', { ascending: false });

    if (!data) { setLoading(false); return; }

    const enriched = await Promise.all(
      data.map(async (match: Match) => {
        const otherId = match.user1_id === user.id ? match.user2_id : match.user1_id;
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', otherId)
          .single();
        return { ...match, otherProfile: profile ?? undefined };
      })
    );

    setMatches(enriched);
    setLoading(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Matches</Text>
        <Text style={styles.count}>{matches.length} matches</Text>
      </View>

      {matches.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No matches yet</Text>
          <Text style={styles.emptySubtitle}>Keep liking profiles — your match is out there!</Text>
        </View>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.matchCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.otherProfile?.full_name?.[0] ?? '?'}
                </Text>
              </View>
              <View style={styles.matchInfo}>
                <Text style={styles.matchName}>{item.otherProfile?.full_name ?? 'Unknown'}</Text>
                <Text style={styles.matchDetail}>
                  {item.otherProfile?.city}, {item.otherProfile?.state} · {item.otherProfile?.religion}
                </Text>
                {item.last_message && (
                  <Text style={styles.lastMessage} numberOfLines={1}>{item.last_message}</Text>
                )}
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  header: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 8, flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: COLORS.text },
  count: { fontSize: 15, color: COLORS.textSecondary },
  list: { padding: 16, gap: 10 },
  matchCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontSize: 22, fontWeight: '700' },
  matchInfo: { flex: 1, gap: 2 },
  matchName: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  matchDetail: { fontSize: 13, color: COLORS.textSecondary },
  lastMessage: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  arrow: { fontSize: 22, color: COLORS.textSecondary },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  emptySubtitle: { fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', paddingHorizontal: 32 },
});
