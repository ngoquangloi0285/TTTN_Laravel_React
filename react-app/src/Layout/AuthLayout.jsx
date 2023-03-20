import { Navigate, Outlet } from 'react-router-dom';
import useAuthContext from '../context/AuthContext'

const AuthLayout = () => {
    const { user } = useAuthContext();
    // if (!user) {
    //     return <>
    //         <div>
    //             {/* {alert('Please login')} */}
    //             <Navigate to="/login" />
    //         </div>
    //     </>
    // }
    // return <Outlet/>
    return user ? <Outlet /> : <Navigate to="/login" />
}
export default AuthLayout;

