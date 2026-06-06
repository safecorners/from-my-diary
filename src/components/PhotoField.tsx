import { ImagePlus, Trash2, Upload } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Button } from "./Button";

type PhotoFieldProps = {
  existingUrl: string | null;
  file: File | null;
  removeExisting: boolean;
  onFileChange: (file: File | null) => void;
  onRemoveExistingChange: (remove: boolean) => void;
};

export function PhotoField({ existingUrl, file, removeExisting, onFileChange, onRemoveExistingChange }: PhotoFieldProps) {
  const localUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  const previewUrl = localUrl ?? (!removeExisting ? existingUrl : null);

  useEffect(() => {
    return () => {
      if (localUrl) {
        URL.revokeObjectURL(localUrl);
      }
    };
  }, [localUrl]);

  return (
    <div className="rounded-2xl border border-hairline bg-surface-raised p-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="min-h-[180px] flex-1 overflow-hidden rounded-xl border border-hairline bg-surface-soft">
          {previewUrl ? (
            <img src={previewUrl} alt="" className="h-full max-h-[320px] w-full object-cover" />
          ) : (
            <div className="paper-texture flex h-full min-h-[180px] items-center justify-center bg-diary-peach/45 text-diary-teal">
              <ImagePlus size={44} aria-hidden />
            </div>
          )}
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-56">
          <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-hairline bg-canvas px-4 text-sm font-semibold text-ink transition hover:bg-surface-soft">
            <Upload size={16} aria-hidden />
            Choose photo
            <input
              className="sr-only"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(event) => {
                const nextFile = event.target.files?.[0] ?? null;
                onFileChange(nextFile);
                if (nextFile) {
                  onRemoveExistingChange(false);
                }
              }}
            />
          </label>
          {file ? (
            <Button variant="secondary" onClick={() => onFileChange(null)}>
              <Trash2 size={16} aria-hidden />
              Remove chosen
            </Button>
          ) : existingUrl ? (
            <Button variant={removeExisting ? "secondary" : "destructive"} onClick={() => onRemoveExistingChange(!removeExisting)}>
              <Trash2 size={16} aria-hidden />
              {removeExisting ? "Keep photo" : "Remove photo"}
            </Button>
          ) : null}
          <p className="text-sm leading-6 text-muted">JPG, PNG, WebP, GIF. 최대 6MB.</p>
        </div>
      </div>
    </div>
  );
}
