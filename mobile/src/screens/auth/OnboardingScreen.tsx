import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  TextInput, ScrollView, Alert,
} from 'react-native';
import { supabase } from '../../services/supabase';
import { useAuthStore } from '../../store/authStore';
import { COLORS, RELIGIONS, MOTHER_TONGUES, VISA_STATUSES, DIET_PREFERENCES } from '../../constants';
import { Religion, VisaStatus, DietPreference, Gender } from '../../types';

const STEPS = ['Basic Info', 'Identity', 'Immigration', 'Lifestyle', 'Done'];

export function OnboardingScreen() {
  const { user, fetchProfile } = useAuthStore();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: '',
    date_of_birth: '',
    gender: '' as Gender,
    city: '',
    state: '',
    religion: '' as Religion,
    caste: '',
    mother_tongue: '',
    visa_status: '' as VisaStatus,
    diet: '' as DietPreference,
    bio: '',
  });

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    const { error } = await supabase.from('profiles').insert({
      user_id: user?.id,
      ...form,
      photos: [],
      is_verified: false,
      is_active: true,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    await fetchProfile();
  };

  const Chip = ({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) => (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Tell us about yourself</Text>
            <TextInput style={styles.input} placeholder="Full Name" value={form.full_name} onChangeText={(v) => update('full_name', v)} />
            <TextInput style={styles.input} placeholder="Date of Birth (YYYY-MM-DD)" value={form.date_of_birth} onChangeText={(v) => update('date_of_birth', v)} />
            <Text style={styles.label}>Gender</Text>
            <View style={styles.chips}>
              {(['Male', 'Female', 'Non-binary'] as Gender[]).map((g) => (
                <Chip key={g} label={g} selected={form.gender === g} onPress={() => update('gender', g)} />
              ))}
            </View>
            <TextInput style={styles.input} placeholder="City" value={form.city} onChangeText={(v) => update('city', v)} />
            <TextInput style={styles.input} placeholder="State (e.g. CA, TX, NY)" value={form.state} onChangeText={(v) => update('state', v)} />
            <TextInput
              style={[styles.input, styles.bioInput]}
              placeholder="Short bio (optional)"
              value={form.bio}
              onChangeText={(v) => update('bio', v)}
              multiline
              numberOfLines={3}
            />
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Your identity</Text>
            <Text style={styles.label}>Religion</Text>
            <View style={styles.chips}>
              {RELIGIONS.map((r) => (
                <Chip key={r} label={r} selected={form.religion === r} onPress={() => update('religion', r)} />
              ))}
            </View>
            <TextInput style={styles.input} placeholder="Caste (optional)" value={form.caste} onChangeText={(v) => update('caste', v)} />
            <Text style={styles.label}>Mother Tongue</Text>
            <View style={styles.chips}>
              {MOTHER_TONGUES.map((lang) => (
                <Chip key={lang} label={lang} selected={form.mother_tongue === lang} onPress={() => update('mother_tongue', lang)} />
              ))}
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Immigration status</Text>
            <Text style={styles.label}>Visa / Residency Status</Text>
            <View style={styles.chips}>
              {VISA_STATUSES.map((v) => (
                <Chip key={v} label={v} selected={form.visa_status === v} onPress={() => update('visa_status', v)} />
              ))}
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Lifestyle</Text>
            <Text style={styles.label}>Diet Preference</Text>
            <View style={styles.chips}>
              {DIET_PREFERENCES.map((d) => (
                <Chip key={d} label={d} selected={form.diet === d} onPress={() => update('diet', d)} />
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressBar}>
        {STEPS.slice(0, -1).map((_, i) => (
          <View key={i} style={[styles.progressSegment, i <= step && styles.progressActive]} />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {renderStep()}
      </ScrollView>

      <View style={styles.footer}>
        {step > 0 && (
          <TouchableOpacity style={styles.backBtn} onPress={() => setStep((s) => s - 1)}>
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextBtn, loading && styles.btnDisabled]}
          onPress={step < 3 ? () => setStep((s) => s + 1) : handleSubmit}
          disabled={loading}
        >
          <Text style={styles.nextBtnText}>{step < 3 ? 'Next' : loading ? 'Creating...' : 'Create Profile'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  progressBar: { flexDirection: 'row', gap: 4, paddingHorizontal: 24, paddingTop: 16 },
  progressSegment: {
    flex: 1, height: 4, borderRadius: 2, backgroundColor: COLORS.border,
  },
  progressActive: { backgroundColor: COLORS.primary },
  scroll: { padding: 24, paddingBottom: 40 },
  stepContent: { gap: 16 },
  stepTitle: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  label: { fontSize: 15, fontWeight: '600', color: COLORS.text, marginTop: 4 },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: COLORS.text,
  },
  bioInput: { minHeight: 80, textAlignVertical: 'top' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  chipSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 14, color: COLORS.text, fontWeight: '500' },
  chipTextSelected: { color: '#fff' },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 24,
    paddingTop: 12,
  },
  backBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backBtnText: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  nextBtn: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  btnDisabled: { opacity: 0.5 },
  nextBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
