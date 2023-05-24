import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthContext from '../context/AuthContext'

const AuthLayout = () => {
    const { currentUser } = useAuthContext();
    return currentUser?.roles === "admin" ? <Outlet/> : <Navigate to="login"/>;
}
export default AuthLayout;


