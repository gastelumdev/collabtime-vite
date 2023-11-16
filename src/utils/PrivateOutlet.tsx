// import { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface PrivateOutletProps {
    redirectPath?: string;
}

export function PrivateOutlet({ redirectPath = "/login" }: PrivateOutletProps) {
    const user = useAuth();

    return localStorage.getItem("token") || user.user ? <Outlet /> : <Navigate to={redirectPath} />;
}
