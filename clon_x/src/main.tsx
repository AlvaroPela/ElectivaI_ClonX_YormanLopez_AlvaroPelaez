import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { BaseRouter } from "./routes/BaseRouter";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/contexts/AuthProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { NavBar } from "./ui/components/NavBar";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <NavBar />
                <BaseRouter />
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
)