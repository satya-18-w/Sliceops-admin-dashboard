import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "../store";


const NonAuth = () => {

    const { user } = useAuthStore();
    if (user !== null) {
        return <Navigate to="/" replace={true} />;


    }
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-50">
            <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-brand-100/60 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-brand-50 blur-3xl" />
            <Outlet />
        </div>
    )
}

export default NonAuth;