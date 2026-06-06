import { CalendarDays, ImageIcon, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { DiaryEntryWithPhotoUrl } from "../types/diary";
import { formatEntryDate } from "../lib/dates";
import { Button } from "./Button";

type EntryCardProps = {
  entry: DiaryEntryWithPhotoUrl;
  deleting: boolean;
  onDelete: (entry: DiaryEntryWithPhotoUrl) => void;
};

export function EntryCard({ entry, deleting, onDelete }: EntryCardProps) {
  const linkClass =
    "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-hairline bg-canvas px-4 text-sm font-semibold text-ink transition hover:bg-surface-soft sm:w-auto";

  return (
    <article className="grid min-h-[260px] overflow-hidden rounded-2xl border border-hairline bg-surface-card sm:grid-cols-[180px_1fr]">
      <div className="relative min-h-[180px] bg-surface-soft">
        {entry.photoUrl ? (
          <img src={entry.photoUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="paper-texture flex h-full min-h-[180px] items-center justify-center bg-diary-lavender/55 text-diary-teal">
            <ImageIcon size={40} aria-hidden />
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-4 p-5">
        <div className="flex items-center gap-2 text-sm text-muted">
          <CalendarDays size={16} aria-hidden />
          <time dateTime={entry.entry_date}>{formatEntryDate(entry.entry_date)}</time>
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="break-words text-2xl font-semibold leading-tight text-ink">{entry.title}</h2>
          <p className="mt-3 line-clamp-4 whitespace-pre-line break-words text-base leading-7 text-body">{entry.body}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link to={`/entries/${entry.id}/edit`} className={linkClass}>
            <Pencil size={16} aria-hidden />
            Edit
          </Link>
          <Button variant="destructive" className="w-full px-4 sm:w-auto" disabled={deleting} onClick={() => onDelete(entry)}>
            <Trash2 size={16} aria-hidden />
            {deleting ? "Deleting" : "Delete"}
          </Button>
        </div>
      </div>
    </article>
  );
}
