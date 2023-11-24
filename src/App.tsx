import "./App.css";
import { default as Workspaces } from "./features/workspaces/View";
import { default as Workspace } from "./features/workspaces/ViewOne";
import { default as DataCollections } from "./features/dataCollections/View";
import { default as DataCollection } from "./features/dataCollections/ViewOne";
import { default as Documents } from "./features/documents/View";
import { default as Tasks } from "./features/tasks/View";
import { default as MessageBoard } from "./features/messageBoard/View";
import { Route, Routes } from "react-router-dom";
import Login from "./features/auth/Login";
import { PrivateOutlet } from "./utils/PrivateOutlet";
import ResetPasswordRequest from "./features/auth/ResetPasswordRequest";
import ResetPassword from "./features/auth/ResetPassword";
import ResetPasswordEmailSent from "./features/auth/ResetPasswordEmailSent";
import Join from "./features/workspaces/Join";

import { useToast } from "@chakra-ui/react";
import { io } from "socket.io-client";
import { useEffect } from "react";

function App() {
    const toast = useToast();
    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URL);
        socket.connect();
        socket.on("update", (item) => {
            console.log("Notifications called for update");

            toast({
                title: "Notification",
                description: item.message,
                status: "info",
            });
            // setNotifications(callNotificationsUpdate(priority) as any);
        });

        socket.on(localStorage.getItem("userId") || "", (item) => {
            toast({
                title: "Notification",
                description: item.message,
                status: item.priority === "Low" ? "success" : item.priority === "Critical" ? "error" : "warning",
            });
        });

        return () => {
            socket.disconnect();
        };
    }, []);
    return (
        <>
            {/* <Layout> */}
            <Routes>
                <Route element={<PrivateOutlet />}>
                    <Route path="workspaces" element={<Workspaces />} />
                    {/* <Route element={<WorkspaceOutlet />}> */}
                    <Route path="workspaces/:id" element={<Workspace />} />
                    <Route path="workspaces/:id/dataCollections" element={<DataCollections />} />
                    <Route path="workspaces/:id/dataCollections/:dataCollectionId" element={<DataCollection />} />
                    <Route path="workspaces/:id/documents" element={<Documents />} />
                    <Route path="workspaces/:id/taskLists" element={<Tasks />} />
                    <Route path="workspaces/:id/messageBoard" element={<MessageBoard />} />
                    {/* </Route> */}
                </Route>
            </Routes>
            <Routes>
                <Route path="" element={<Login />} />
                <Route path="login" element={<Login />} />
                <Route path="resetPasswordRequest" element={<ResetPasswordRequest />} />
                <Route path="passwordReset" element={<ResetPassword />} />
                <Route path="resetPasswordEmailSent" element={<ResetPasswordEmailSent />} />
                <Route path="joinWorkspace" element={<Join />} />
            </Routes>
        </>
    );
}

export default App;
