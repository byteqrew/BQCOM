import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { supabase } from './supabase';

const BUCKET = 'profile-photos';
const MAX_DIMENSION = 1080;
const COMPRESS_QUALITY = 0.8;

async function compressImage(uri: string): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: MAX_DIMENSION } }],
    { compress: COMPRESS_QUALITY, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
}

async function uriToBlob(uri: string): Promise<Blob> {
  const response = await fetch(uri);
  return response.blob();
}

export async function pickAndUploadPhoto(userId: string): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [3, 4],
    quality: 1,
  });

  if (result.canceled || !result.assets[0]) return null;

  const compressed = await compressImage(result.assets[0].uri);
  const blob = await uriToBlob(compressed);

  const fileName = `${userId}/${Date.now()}.jpg`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, blob, { contentType: 'image/jpeg', upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  return data.publicUrl;
}

export async function deletePhoto(userId: string, url: string): Promise<void> {
  // Extract the file path from the public URL
  const path = url.split(`${BUCKET}/`)[1];
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]);
}

export async function updateProfilePhotos(userId: string, photos: string[]): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ photos })
    .eq('user_id', userId);
  if (error) throw error;
}
