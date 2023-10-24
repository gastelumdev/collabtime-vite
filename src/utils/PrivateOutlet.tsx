import { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface PrivateOutletProps {
    isAllowed: boolean;
    redirectPath?: string;
    children?: ReactNode;
}

export function PrivateOutlet({
    isAllowed,
    redirectPath = "/login",
    children,
}: PrivateOutletProps) {
    // const auth = useAuth();
    // const location = useLocation();

    return localStorage.getItem("token") || isAllowed ? (
        <Outlet />
    ) : (
        <Navigate to={redirectPath} />
    );
}
