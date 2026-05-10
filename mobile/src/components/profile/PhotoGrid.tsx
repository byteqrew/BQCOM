import React, { useState } from 'react';
import {
  View, Image, StyleSheet, TouchableOpacity, Text,
  Alert, ActivityIndicator, Dimensions,
} from 'react-native';
import { pickAndUploadPhoto, deletePhoto, updateProfilePhotos } from '../../services/photoService';
import { useAuthStore } from '../../store/authStore';
import { COLORS, MAX_PHOTOS } from '../../constants';

const { width } = Dimensions.get('window');
const CELL = (width - 48 - 16) / 3; // 3 columns with padding and gaps

interface Props {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
}

export function PhotoGrid({ photos, onPhotosChange }: Props) {
  const { user } = useAuthStore();
  const [uploading, setUploading] = useState(false);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!user) return;
    if (photos.length >= MAX_PHOTOS) {
      Alert.alert('Limit reached', `You can upload up to ${MAX_PHOTOS} photos.`);
      return;
    }

    setUploading(true);
    try {
      const url = await pickAndUploadPhoto(user.id);
      if (!url) return;
      const updated = [...photos, url];
      await updateProfilePhotos(user.id, updated);
      onPhotosChange(updated);
    } catch {
      Alert.alert('Upload failed', 'Could not upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (url: string) => {
    Alert.alert(
      'Remove photo',
      'Are you sure you want to remove this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            if (!user) return;
            setDeletingUrl(url);
            try {
              await deletePhoto(user.id, url);
              const updated = photos.filter((p) => p !== url);
              await updateProfilePhotos(user.id, updated);
              onPhotosChange(updated);
            } catch {
              Alert.alert('Error', 'Could not remove photo.');
            } finally {
              setDeletingUrl(null);
            }
          },
        },
      ]
    );
  };

  const slots = Array.from({ length: MAX_PHOTOS });

  return (
    <View style={styles.grid}>
      {slots.map((_, i) => {
        const photo = photos[i];

        if (photo) {
          const isDeleting = deletingUrl === photo;
          return (
            <View key={i} style={styles.cell}>
              <Image source={{ uri: photo }} style={styles.photo} />
              {i === 0 && (
                <View style={styles.mainBadge}>
                  <Text style={styles.mainBadgeText}>Main</Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(photo)}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.deleteBtnText}>✕</Text>
                )}
              </TouchableOpacity>
            </View>
          );
        }

        if (i === photos.length) {
          return (
            <TouchableOpacity
              key={i}
              style={[styles.cell, styles.addCell]}
              onPress={handleAdd}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator color={COLORS.primary} />
              ) : (
                <>
                  <Text style={styles.addIcon}>+</Text>
                  <Text style={styles.addLabel}>Add photo</Text>
                </>
              )}
            </TouchableOpacity>
          );
        }

        return <View key={i} style={[styles.cell, styles.emptyCell]} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cell: {
    width: CELL,
    height: CELL * 1.33,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  addCell: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  emptyCell: {
    backgroundColor: COLORS.border,
    opacity: 0.3,
  },
  addIcon: {
    fontSize: 28,
    color: COLORS.primary,
    fontWeight: '300',
  },
  addLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  mainBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  mainBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  deleteBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
});
