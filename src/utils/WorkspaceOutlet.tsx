// import { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
import { useGetUserQuery } from "../app/services/api";

export function WorkspaceOutlet() {
    // const user = useAuth();
    if (localStorage.getItem("workspaceId") === "none") return <Navigate to={"/workspaces"} />;
    const { data: user } = useGetUserQuery(localStorage.getItem("userId") || "");
    let allowUserToWorkspace = false;

    for (const workspace of user?.workspaces || []) {
        if (workspace.id == localStorage.getItem("workspaceId")) {
            allowUserToWorkspace = true;
        }
    }

    return !allowUserToWorkspace ? <Navigate to={"/workspaces"} /> : <Outlet />;
}

export default WorkspaceOutlet;
