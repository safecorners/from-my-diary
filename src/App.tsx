import { Navigate, Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";
import { HomePage } from "./pages/HomePage";
import { EntryFormPage } from "./pages/EntryFormPage";
import { LoginPage } from "./pages/LoginPage";
import { LoadingState } from "./components/LoadingState";
import { useAuth } from "./lib/auth";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { loading, user } = useAuth();

  if (loading) {
    return <LoadingState label="일기장을 여는 중" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function App() {
  const { loading, user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={loading ? <LoadingState label="세션 확인 중" /> : user ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/entries/new"
        element={
          <ProtectedRoute>
            <EntryFormPage mode="new" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/entries/:entryId/edit"
        element={
          <ProtectedRoute>
            <EntryFormPage mode="edit" />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
