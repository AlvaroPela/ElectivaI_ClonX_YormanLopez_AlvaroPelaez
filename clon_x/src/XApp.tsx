import { BaseRouter } from "./routes/BaseRouter";
import { NavBar } from "./ui/components/NavBar";
import { useContext } from "react";
import { AuthContext } from "./auth/contexts/AuthContext";

export const XApp = () => {
  const { authState } = useContext(AuthContext);
  return (
    <div>
      {authState.logged && <NavBar />}
      <BaseRouter />
    </div>
  );
};
