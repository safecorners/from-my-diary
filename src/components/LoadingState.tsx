export function LoadingState({ label }: { label: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-6 text-ink">
      <div className="flex items-center gap-3 rounded-2xl border border-hairline bg-surface-raised px-5 py-4 shadow-soft">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-ink" aria-hidden />
        <span className="text-sm font-medium text-body">{label}</span>
      </div>
    </main>
  );
}
