// import { useState } from "react";
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
// import { IUser } from "./types";
import { PrivateOutlet } from "./utils/PrivateOutlet";
import ResetPasswordRequest from "./features/auth/ResetPasswordRequest";
import ResetPassword from "./features/auth/ResetPassword";
import ResetPasswordEmailSent from "./features/auth/ResetPasswordEmailSent";
import Join from "./features/workspaces/Join";

// const user: IUser = {
//     _id: "1",
//     firstname: "Omar",
//     lastname: "Gastelum",
//     email: "omargastelum@email.com",
//     password: "somepassword",
//     workspaces: [
//         {
//             _id: "1",
//             name: "Workspace 1",
//             description: "This is a sample workspace.",
//             tools: {
//                 dataCollections: { access: 2 },
//                 taskLists: { access: 2 },
//                 docs: { access: 2 },
//                 messageBoard: { access: 2 },
//             },
//         },
//         {
//             _id: "2",
//             name: "Workspace 2",
//             description: "This is another sample workspace.",
//             tools: {
//                 dataCollections: { access: 1 },
//                 taskLists: { access: 1 },
//                 docs: { access: 1 },
//                 messageBoard: { access: 1 },
//             },
//         },
//     ],
// };

function App() {
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
