import type { User } from "@supabase/supabase-js";
import { requireSupabase } from "./supabase";
import type { DiaryEntry, DiaryEntryWithPhotoUrl, EntryFormValues } from "../types/diary";

const PHOTO_BUCKET = "diary-photos";
const SIGNED_URL_SECONDS = 60 * 60;
const MAX_PHOTO_BYTES = 6 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export function validatePhoto(file: File) {
  if (!ALLOWED_PHOTO_TYPES.has(file.type)) {
    throw new Error("사진은 JPG, PNG, WebP, GIF 형식만 사용할 수 있습니다.");
  }

  if (file.size > MAX_PHOTO_BYTES) {
    throw new Error("사진은 6MB 이하만 업로드할 수 있습니다.");
  }
}

export async function listEntries(): Promise<DiaryEntryWithPhotoUrl[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("diary_entries")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  const entries = (data ?? []) as DiaryEntry[];

  return Promise.all(
    entries.map(async (entry) => ({
      ...entry,
      photoUrl: await getSignedPhotoUrl(entry.photo_path),
    })),
  );
}

export async function getEntry(entryId: string): Promise<DiaryEntryWithPhotoUrl> {
  const client = requireSupabase();
  const { data, error } = await client.from("diary_entries").select("*").eq("id", entryId).single();

  if (error) {
    throw error;
  }

  const entry = data as DiaryEntry;

  return {
    ...entry,
    photoUrl: await getSignedPhotoUrl(entry.photo_path),
  };
}

export async function createEntry(user: User, values: EntryFormValues, photo: File | null) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("diary_entries")
    .insert({
      user_id: user.id,
      entry_date: values.entry_date,
      title: values.title.trim(),
      body: values.body.trim(),
      photo_path: null,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  const entry = data as DiaryEntry;

  try {
    if (!photo) {
      return entry;
    }

    validatePhoto(photo);
    const photoPath = await uploadPhoto(user.id, entry.id, photo);
    const { data: updated, error: updateError } = await client
      .from("diary_entries")
      .update({ photo_path: photoPath, updated_at: new Date().toISOString() })
      .eq("id", entry.id)
      .select("*")
      .single();

    if (updateError) {
      await removePhoto(photoPath);
      throw updateError;
    }

    return updated as DiaryEntry;
  } catch (error) {
    await client.from("diary_entries").delete().eq("id", entry.id);
    throw error;
  }
}

export async function updateEntry(
  entry: DiaryEntry,
  user: User,
  values: EntryFormValues,
  photo: File | null,
  removeExistingPhoto: boolean,
) {
  const client = requireSupabase();
  let nextPhotoPath = entry.photo_path;

  if (photo) {
    validatePhoto(photo);
    const uploadedPath = await uploadPhoto(user.id, entry.id, photo);

    if (entry.photo_path) {
      await removePhoto(entry.photo_path);
    }

    nextPhotoPath = uploadedPath;
  } else if (removeExistingPhoto && entry.photo_path) {
    await removePhoto(entry.photo_path);
    nextPhotoPath = null;
  }

  const { data, error } = await client
    .from("diary_entries")
    .update({
      entry_date: values.entry_date,
      title: values.title.trim(),
      body: values.body.trim(),
      photo_path: nextPhotoPath,
      updated_at: new Date().toISOString(),
    })
    .eq("id", entry.id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as DiaryEntry;
}

export async function deleteEntry(entry: DiaryEntry) {
  const client = requireSupabase();

  if (entry.photo_path) {
    await removePhoto(entry.photo_path);
  }

  const { error } = await client.from("diary_entries").delete().eq("id", entry.id);

  if (error) {
    throw error;
  }
}

async function getSignedPhotoUrl(path: string | null) {
  if (!path) {
    return null;
  }

  const client = requireSupabase();
  const { data, error } = await client.storage.from(PHOTO_BUCKET).createSignedUrl(path, SIGNED_URL_SECONDS);

  if (error) {
    return null;
  }

  return data.signedUrl;
}

async function uploadPhoto(userId: string, entryId: string, file: File) {
  const client = requireSupabase();
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-|-$/g, "");
  const fileName = `${Date.now()}-${crypto.randomUUID()}-${safeName || "diary-photo"}`;
  const path = `${userId}/${entryId}/${fileName}`;
  const { error } = await client.storage.from(PHOTO_BUCKET).upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw error;
  }

  return path;
}

async function removePhoto(path: string) {
  const client = requireSupabase();
  const { error } = await client.storage.from(PHOTO_BUCKET).remove([path]);

  if (error) {
    throw error;
  }
}
