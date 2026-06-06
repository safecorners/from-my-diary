import { ArrowLeft, Save } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { Button } from "../components/Button";
import { PhotoField } from "../components/PhotoField";
import { createEntry, getEntry, updateEntry } from "../lib/diaryService";
import { todayInputValue } from "../lib/dates";
import { useAuth } from "../lib/auth";
import type { DiaryEntryWithPhotoUrl, EntryFormValues } from "../types/diary";

type EntryFormPageProps = {
  mode: "new" | "edit";
};

export function EntryFormPage({ mode }: EntryFormPageProps) {
  const { entryId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [entry, setEntry] = useState<DiaryEntryWithPhotoUrl | null>(null);
  const [values, setValues] = useState<EntryFormValues>({
    entry_date: todayInputValue(),
    title: "",
    body: "",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [removeExistingPhoto, setRemoveExistingPhoto] = useState(false);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== "edit" || !entryId) return;

    let active = true;

    async function loadEntry() {
      setLoading(true);
      setError(null);

      try {
        const loaded = await getEntry(entryId!);
        if (!active) return;
        setEntry(loaded);
        setValues({
          entry_date: loaded.entry_date,
          title: loaded.title,
          body: loaded.body,
        });
      } catch (nextError) {
        if (!active) return;
        setError(nextError instanceof Error ? nextError.message : "일기를 불러오지 못했습니다.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadEntry();

    return () => {
      active = false;
    };
  }, [entryId, mode]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) return;

    if (!values.title.trim() || !values.body.trim()) {
      setError("제목과 본문을 입력해 주세요.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (mode === "new") {
        await createEntry(user, values, photo);
      } else if (entry) {
        await updateEntry(entry, user, values, photo, removeExistingPhoto);
      }

      navigate("/");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  const secondaryLinkClass =
    "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-hairline bg-canvas px-5 text-sm font-semibold text-ink transition hover:bg-surface-soft";

  return (
    <AppShell>
      <section className="mx-auto max-w-[720px]">
        <Link to="/" className={`mb-5 ${secondaryLinkClass}`}>
          <ArrowLeft size={17} aria-hidden />
          Back
        </Link>

        <div className="rounded-2xl border border-hairline bg-surface-raised p-5 shadow-soft sm:p-8">
          <h1 className="text-3xl font-semibold leading-tight text-ink">{mode === "new" ? "새 일기" : "일기 수정"}</h1>

          {loading ? (
            <div className="mt-8 h-80 animate-pulse rounded-2xl bg-surface-soft" />
          ) : (
            <form className="mt-8 flex flex-col gap-5" onSubmit={(event) => void handleSubmit(event)}>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-body">Date</span>
                <input
                  required
                  type="date"
                  className="h-11 rounded-xl border border-hairline bg-surface-raised px-4 text-body outline-none transition focus:border-diary-teal"
                  value={values.entry_date}
                  onChange={(event) => setValues((current) => ({ ...current, entry_date: event.target.value }))}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-body">Title</span>
                <input
                  required
                  maxLength={120}
                  className="h-11 rounded-xl border border-hairline bg-surface-raised px-4 text-body outline-none transition focus:border-diary-teal"
                  placeholder="오늘의 제목"
                  value={values.title}
                  onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-body">Body</span>
                <textarea
                  required
                  maxLength={8000}
                  rows={10}
                  className="min-h-56 resize-y rounded-xl border border-hairline bg-surface-raised px-4 py-3 text-body outline-none transition focus:border-diary-teal"
                  placeholder="오늘 남기고 싶은 순간을 적어보세요."
                  value={values.body}
                  onChange={(event) => setValues((current) => ({ ...current, body: event.target.value }))}
                />
              </label>

              <PhotoField
                existingUrl={entry?.photoUrl ?? null}
                file={photo}
                removeExisting={removeExistingPhoto}
                onFileChange={setPhoto}
                onRemoveExistingChange={setRemoveExistingPhoto}
              />

              {error ? <p className="rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">{error}</p> : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Link to="/" className={`${secondaryLinkClass} ${saving ? "pointer-events-none opacity-55" : ""}`}>
                  Cancel
                </Link>
                <Button type="submit" disabled={saving}>
                  <Save size={17} aria-hidden />
                  {saving ? "Saving" : "Save"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>
    </AppShell>
  );
}
