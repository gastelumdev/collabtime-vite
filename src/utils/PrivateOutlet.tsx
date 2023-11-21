// import { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface PrivateOutletProps {
    redirectPath?: string;
}

export function PrivateOutlet({ redirectPath = "/login" }: PrivateOutletProps) {
    if (!localStorage.getItem("workspaceId")) localStorage.setItem("workspaceId", "none");

    if (!localStorage.getItem("token")) {
        localStorage.removeItem("userId");
        localStorage.removeItem("dataCollectionId");
    }

    return localStorage.getItem("token") ? <Outlet /> : <Navigate to={redirectPath} />;
}
