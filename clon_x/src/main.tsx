import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { BlogApp } from "./BlogApp";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BlogApp />
    </StrictMode>
)