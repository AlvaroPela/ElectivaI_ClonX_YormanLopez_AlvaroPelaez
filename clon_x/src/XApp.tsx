import { BaseRouter } from "./routes/BaseRouter";
import { NavBar } from "./ui/components/NavBar";
import { useContext } from "react";
import { AuthContext } from "./auth/contexts/AuthContext";
import { useLocation } from "react-router-dom";

export const XApp = () => {
  const { authState } = useContext(AuthContext);
  const { pathname } = useLocation();

  return (
    <div>
      {authState.logged && pathname !== "/" && <NavBar />}
      <BaseRouter />
    </div>
  );
};
