import { Plus, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { Button } from "../components/Button";
import { EntryCard } from "../components/EntryCard";
import { deleteEntry, listEntries } from "../lib/diaryService";
import type { DiaryEntryWithPhotoUrl } from "../types/diary";

export function HomePage() {
  const [entries, setEntries] = useState<DiaryEntryWithPhotoUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadEntries() {
    setLoading(true);
    setError(null);

    try {
      setEntries(await listEntries());
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "일기 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadEntries();
  }, []);

  async function handleDelete(entry: DiaryEntryWithPhotoUrl) {
    const confirmed = window.confirm("이 일기를 삭제할까요? 연결된 사진도 함께 삭제됩니다.");

    if (!confirmed) return;

    setDeletingId(entry.id);
    setError(null);

    try {
      await deleteEntry(entry);
      setEntries((current) => current.filter((item) => item.id !== entry.id));
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "삭제에 실패했습니다.");
    } finally {
      setDeletingId(null);
    }
  }

  const primaryLinkClass =
    "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-5 text-sm font-semibold text-on-primary transition hover:bg-body";

  return (
    <AppShell>
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-diary-teal px-3 py-1 text-sm font-semibold text-on-primary">
              Private diary
            </span>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-ink">최근 일기</h1>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="secondary" onClick={() => void loadEntries()}>
              <RefreshCw size={16} aria-hidden />
              Refresh
            </Button>
            <Link to="/entries/new" className={primaryLinkClass}>
              <Plus size={17} aria-hidden />
              New entry
            </Link>
          </div>
        </div>

        {error ? <p className="rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">{error}</p> : null}

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[0, 1].map((item) => (
              <div key={item} className="h-64 animate-pulse rounded-2xl border border-hairline bg-surface-card" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="paper-texture rounded-3xl border border-hairline bg-surface-soft px-6 py-14 text-center">
            <h2 className="text-2xl font-semibold text-ink">첫 일기를 남겨보세요.</h2>
            <Link to="/entries/new" className={`mt-6 ${primaryLinkClass}`}>
              <Plus size={17} aria-hidden />
              New entry
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} deleting={deletingId === entry.id} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
