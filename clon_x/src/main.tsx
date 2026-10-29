import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { BaseRouter } from "./routes/BaseRouter";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <BaseRouter />
        </BrowserRouter>
    </StrictMode>
)