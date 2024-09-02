import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../provider/AuthProvider"

export const ProtectedRoute = () => {
    const { token } = useAuth()
    const location = useLocation()
    const unprotectedPaths = ['/register']

    if (unprotectedPaths.includes(location.pathname)) {
        return <Outlet />
    }

    if (!token) {
        return <Navigate to="/login" />
    }

    return <Outlet />
}