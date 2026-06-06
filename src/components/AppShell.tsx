import { BookOpen, LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./Button";
import { useAuth } from "../lib/auth";

export function AppShell({ children }: { children: ReactNode }) {
  const { signOut, user } = useAuth();
  const userLabel = user?.user_metadata?.user_name ?? user?.email ?? "GitHub user";

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="border-b border-hairline bg-surface-soft">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-diary-peach text-ink">
              <BookOpen size={20} aria-hidden />
            </div>
            <div>
              <p className="text-lg font-semibold leading-tight">From My Diary</p>
              <p className="text-sm text-muted">{userLabel}</p>
            </div>
          </div>
          <Button variant="secondary" className="w-full sm:w-auto" onClick={() => void signOut()}>
            <LogOut size={17} aria-hidden />
            Logout
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-[1120px] px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
