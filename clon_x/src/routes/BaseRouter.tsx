import {Navigate, Route, Routes} from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { NotificationsPage } from "../pages/NotificationsPage";
import { ChatsPage } from "../pages/ChatsPage";
import { HistoryPage } from "../pages/HistoryPage";
import { ProfilePage } from "../pages/ProfilePage";

export const BaseRouter = () => {

    return (
        <>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/chats" element={<ChatsPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        </>
    )
}
