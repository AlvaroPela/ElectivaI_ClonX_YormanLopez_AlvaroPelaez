import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/contexts/AuthProvider";
import { PostProvider } from "./posts/contexts/PostProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/global.css";
import { XApp } from "./XApp";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <PostProvider>
                    <XApp />
                </PostProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
)