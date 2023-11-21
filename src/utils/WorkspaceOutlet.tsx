// import { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
import { useGetUserQuery } from "../app/services/api";

export function WorkspaceOutlet() {
    // const user = useAuth();
    if (localStorage.getItem("workspaceId") === "none") return <Navigate to={"/workspaces"} />;
    const { data: user } = useGetUserQuery(localStorage.getItem("userId") || "");
    let allowUserToWorkspace = false;

    console.log(user);
    console.log(localStorage.getItem("workspaceId"));

    for (const workspace of user?.workspaces || []) {
        console.log(workspace.id);
        if (workspace.id == localStorage.getItem("workspaceId")) {
            allowUserToWorkspace = true;
            console.log(allowUserToWorkspace);
        }
    }

    console.log(!allowUserToWorkspace);

    return !allowUserToWorkspace ? <Navigate to={"/workspaces"} /> : <Outlet />;
}

export default WorkspaceOutlet;
