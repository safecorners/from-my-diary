import { Github, LockKeyhole } from "lucide-react";
import { Button } from "../components/Button";
import { useAuth } from "../lib/auth";
import { useState } from "react";

export function LoginPage() {
  const { configured, signInWithGithub } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError(null);
    setLoading(true);

    try {
      await signInWithGithub();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "로그인에 실패했습니다.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <section className="mx-auto grid min-h-screen max-w-[1120px] items-center gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_440px] lg:px-8">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-diary-teal px-4 py-2 text-sm font-semibold text-on-primary">
            <LockKeyhole size={16} aria-hidden />
            Private diary
          </div>
          <h1 className="text-5xl font-semibold leading-[1.04] sm:text-6xl">From My Diary</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-body">
            GitHub로 로그인하고, 본인만 볼 수 있는 일상을 조용히 기록하세요.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button className="w-full sm:w-auto" disabled={!configured || loading} onClick={() => void handleLogin()}>
              <Github size={18} aria-hidden />
              {loading ? "Connecting" : "Continue with GitHub"}
            </Button>
          </div>
          {!configured ? (
            <p className="mt-4 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-body">
              `VITE_SUPABASE_URL`과 `VITE_SUPABASE_PUBLISHABLE_KEY`를 설정해야 로그인할 수 있습니다.
            </p>
          ) : null}
          {error ? <p className="mt-4 rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">{error}</p> : null}
        </div>

        <div className="paper-texture relative min-h-[420px] overflow-hidden rounded-3xl border border-hairline bg-surface-card p-6 shadow-soft">
          <div className="absolute left-8 top-8 h-56 w-40 rotate-[-8deg] rounded-2xl border border-hairline bg-surface-raised shadow-soft" />
          <div className="absolute right-8 top-12 h-44 w-52 rotate-[5deg] overflow-hidden rounded-2xl border border-hairline bg-diary-lavender">
            <div className="h-2/3 bg-diary-pink" />
            <div className="h-1/3 bg-surface-raised" />
          </div>
          <div className="absolute bottom-8 left-10 right-10 rounded-2xl border border-hairline bg-surface-raised p-5">
            <div className="mb-4 h-3 w-28 rounded-full bg-diary-ochre" />
            <div className="space-y-3">
              <div className="h-3 rounded-full bg-hairline" />
              <div className="h-3 w-4/5 rounded-full bg-hairline" />
              <div className="h-3 w-2/3 rounded-full bg-hairline" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
