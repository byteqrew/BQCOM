import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { PhotoGrid } from '../../components/profile/PhotoGrid';
import { COLORS } from '../../constants';

export function ProfileScreen() {
  const { profile, setProfile, signOut } = useAuthStore();
  const [photos, setPhotos] = useState<string[]>(profile?.photos ?? []);

  if (!profile) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.loading}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  const age = profile.date_of_birth
    ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear()
    : null;

  const handlePhotosChange = (updated: string[]) => {
    setPhotos(updated);
    setProfile({ ...profile, photos: updated });
  };

  const Row = ({ label, value }: { label: string; value?: string | number | null }) => {
    if (!value && value !== 0) return null;
    return (
      <View style={styles.row}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{String(value)}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.name}>{profile.full_name}{age ? `, ${age}` : ''}</Text>
          <Text style={styles.location}>{profile.city}, {profile.state}</Text>
          {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <Text style={styles.photoHint}>Tap + to add · Tap ✕ to remove · First photo is your main photo</Text>
          <PhotoGrid photos={photos} onPhotosChange={handlePhotosChange} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identity</Text>
          <Row label="Religion" value={profile.religion} />
          <Row label="Caste" value={profile.caste} />
          <Row label="Mother Tongue" value={profile.mother_tongue} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Immigration</Text>
          <Row label="Status" value={profile.visa_status} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lifestyle</Text>
          <Row label="Diet" value={profile.diet} />
        </View>

        {profile.horoscope && Object.keys(profile.horoscope).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Horoscope</Text>
            <Row label="Rashi" value={profile.horoscope.rashi} />
            <Row label="Nakshatra" value={profile.horoscope.nakshatra} />
            <Row label="Gotra" value={profile.horoscope.gotra} />
            <Row label="Manglik" value={profile.horoscope.manglik !== undefined ? (profile.horoscope.manglik ? 'Yes' : 'No') : null} />
          </View>
        )}

        <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  loading: { color: COLORS.textSecondary, fontSize: 16 },
  scroll: { padding: 24, gap: 20, paddingBottom: 40 },
  header: { gap: 4 },
  name: { fontSize: 26, fontWeight: '800', color: COLORS.text },
  location: { fontSize: 15, color: COLORS.textSecondary },
  bio: { fontSize: 15, color: COLORS.text, lineHeight: 22, marginTop: 4 },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  photoHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: -4,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel: { fontSize: 15, color: COLORS.text },
  rowValue: { fontSize: 15, color: COLORS.textSecondary, fontWeight: '500' },
  signOutBtn: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  signOutText: { color: COLORS.error, fontSize: 16, fontWeight: '700' },
});
