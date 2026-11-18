import { useContext } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { AuthContext } from "../auth/contexts/AuthContext";
import { ChatsPage } from "../pages/ChatsPage";
import { HistoryPage } from "../pages/HistoryPage";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../auth/pages/LoginPage";
import { NotificationsPage } from "../pages/NotificationsPage";
import { ProfilePage } from "../pages/ProfilePage";
import { RegisterPage } from "../auth/pages/RegisterPage";

const PrivateRoutes = () => {
  const { authState } = useContext(AuthContext);
  const location = useLocation();

  if (authState.loading) {
    return (
      <main className="auth-loading" aria-label="Comprobando sesión">
        <span className="spinner-border text-primary" role="status" />
      </main>
    );
  }

  if (!authState.logged) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
};

export const BaseRouter = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route element={<PrivateRoutes />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/chats" element={<ChatsPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
