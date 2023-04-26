import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthContext from '../context/AuthContext'

const AuthLayout = () => {
    const { user } = useAuthContext();
    return user?.roles === "admin" ? <Outlet/> : <Navigate to="login"/>;
}
export default AuthLayout;


