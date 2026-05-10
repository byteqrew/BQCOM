import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  ActivityIndicator, Dimensions, Image, ScrollView,
} from 'react-native';
import { supabase } from '../../services/supabase';
import { useAuthStore } from '../../store/authStore';
import { UserProfile } from '../../types';
import { COLORS } from '../../constants';

const { width } = Dimensions.get('window');

export function DiscoverScreen() {
  const { user, profile } = useAuthStore();
  const [candidates, setCandidates] = useState<UserProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    if (!user || !profile) return;
    setLoading(true);

    const oppositeGender = profile.gender === 'Male' ? 'Female' : 'Male';

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('gender', oppositeGender)
      .eq('is_active', true)
      .neq('user_id', user.id)
      .limit(20);

    setCandidates(data ?? []);
    setLoading(false);
  };

  const handleAction = async (action: 'like' | 'pass' | 'superlike') => {
    const current = candidates[currentIndex];
    if (!current || !user) return;

    if (action !== 'pass') {
      await supabase.from('likes').insert({
        from_user_id: user.id,
        to_user_id: current.user_id,
        is_super_like: action === 'superlike',
      });
    }

    setCurrentIndex((i) => i + 1);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  const current = candidates[currentIndex];

  if (!current) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.emptyTitle}>You've seen everyone!</Text>
        <Text style={styles.emptySubtitle}>Check back soon for new profiles</Text>
        <TouchableOpacity style={styles.refreshBtn} onPress={fetchCandidates}>
          <Text style={styles.refreshBtnText}>Refresh</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const age = current.date_of_birth
    ? new Date().getFullYear() - new Date(current.date_of_birth).getFullYear()
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
      </View>

      <View style={styles.card}>
        {/* Photo carousel */}
        {current.photos?.length > 0 ? (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.photoScroll}
          >
            {current.photos.map((uri, i) => (
              <Image key={i} source={{ uri }} style={styles.photo} />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoInitial}>{current.full_name[0]}</Text>
            <Text style={styles.photoPlaceholderText}>No photos yet</Text>
          </View>
        )}

        {/* Photo dot indicators */}
        {current.photos?.length > 1 && (
          <View style={styles.dots}>
            {current.photos.map((_, i) => (
              <View key={i} style={[styles.dot, i === 0 && styles.dotActive]} />
            ))}
          </View>
        )}

        <View style={styles.cardInfo}>
          <Text style={styles.name}>
            {current.full_name}{age ? `, ${age}` : ''}
          </Text>
          <Text style={styles.details}>
            {current.city}, {current.state} · {current.religion} · {current.mother_tongue}
          </Text>
          <Text style={styles.details}>{current.visa_status} · {current.diet}</Text>
          {current.bio ? <Text style={styles.bio}>{current.bio}</Text> : null}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, styles.passBtn]} onPress={() => handleAction('pass')}>
          <Text style={styles.actionIcon}>✕</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, styles.superBtn]} onPress={() => handleAction('superlike')}>
          <Text style={styles.actionIcon}>★</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, styles.likeBtn]} onPress={() => handleAction('like')}>
          <Text style={styles.actionIcon}>♥</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.counter}>{currentIndex + 1} / {candidates.length}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background, gap: 12 },
  header: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 8 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: COLORS.text },
  card: {
    margin: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    flex: 1,
  },
  photoScroll: {
    height: width - 32,
  },
  photoPlaceholder: {
    height: width - 32,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  photo: { width: width - 32, height: width - 32 },
  photoInitial: { fontSize: 56, color: COLORS.textSecondary },
  photoPlaceholderText: { color: COLORS.textSecondary, fontSize: 15 },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    paddingTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },
  dotActive: { backgroundColor: COLORS.primary },
  cardInfo: { padding: 16, gap: 4 },
  name: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  details: { fontSize: 14, color: COLORS.textSecondary },
  bio: { fontSize: 15, color: COLORS.text, marginTop: 6, lineHeight: 22 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  actionBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  passBtn: { backgroundColor: '#fff', borderWidth: 2, borderColor: COLORS.pass },
  likeBtn: { backgroundColor: COLORS.like },
  superBtn: { backgroundColor: COLORS.superLike },
  actionIcon: { fontSize: 26, color: '#fff' },
  counter: { textAlign: 'center', color: COLORS.textSecondary, fontSize: 13, paddingBottom: 8 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  emptySubtitle: { fontSize: 15, color: COLORS.textSecondary },
  refreshBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  refreshBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
