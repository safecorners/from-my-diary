export type DiaryEntry = {
  id: string;
  user_id: string;
  entry_date: string;
  title: string;
  body: string;
  photo_path: string | null;
  created_at: string;
  updated_at: string;
};

export type DiaryEntryWithPhotoUrl = DiaryEntry & {
  photoUrl: string | null;
};

export type EntryFormValues = {
  entry_date: string;
  title: string;
  body: string;
};
