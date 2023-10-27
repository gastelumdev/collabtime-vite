// import { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface PrivateOutletProps {
    redirectPath?: string;
    // children?: ReactNode;
}

export function PrivateOutlet({
    redirectPath = "/login",
}: // children,
PrivateOutletProps) {
    // const auth = useAuth();
    // const location = useLocation();

    const user = useAuth();

    console.log(user.user);

    return localStorage.getItem("token") || user.user ? (
        <Outlet />
    ) : (
        <Navigate to={redirectPath} />
    );
}
