import { BaseRouter } from "./routes/BaseRouter";
import { NavBar } from "./ui/components/NavBar";
import { useContext } from "react";
import { AuthContext } from "./auth/contexts/AuthContext";
import { useLocation } from "react-router-dom";

export const XApp = () => {
  const { authState } = useContext(AuthContext);
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isPrivatePage = authState.logged && !isAuthPage;

  return (
    <div className={isPrivatePage ? "x-app-layout" : undefined}>
      {isPrivatePage && <NavBar />}
      <BaseRouter />
    </div>
  );
};
