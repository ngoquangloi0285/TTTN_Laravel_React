import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // const [user, setUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState([]);

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const csrf = () => axios.get("/sanctum/csrf-cookie");

    const getStatus = {
        REGISTER_SUCCESS: "Register successfully",
        CHANGE_PASSWORD_SUCCESS: "Change Password Success"
    };
    const handleErrors = (error) => {
        if (error.response.status === 422) {
            setErrors(error.response.data.errors);
        } else if (error.response.status === 401) {
            setErrors(error.response.data.errors);
        } else if (error.response.status === 404) {
            setErrors(error.response.data.errors);
        } else if (error.response.status === 500) {
            setErrors(error.response.data.errors);
        }
    };

    const getUser = useCallback(async () => {
        try {
            const { data } = await axios.get("/api/users/v1/user");
            setCurrentUser(data);
            if (data.roles === "admin") {
                navigate("/admin");
            }
        } catch (error) {
            console.error(error);
        }
    }, [navigate]);

    const login = async (formData, callback) => {
        setIsLoading(false);
        try {
            await csrf();
            await axios.post("/login", formData);
            await getUser();
            setIsLoading(true);
            navigate("/");
            if (callback) {
                callback();
            }
        } catch (error) {
            setIsLoading(true);
            handleErrors(error);
        }
    };

    const register = async (data, callback) => {
        setIsLoading(false);
        try {
            await csrf();
            await axios.post('/register', data);
            await getUser();
            setIsLoading(true);
            navigate("/");
            getStatus(status.REGISTER_SUCCESS);
            callback();
        } catch (error) {
            setIsLoading(true);
            handleErrors(error);
        }
    };

    const logout = async () => {
        try {
            await axios.post('/logout');
            setCurrentUser(null);
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    };


    const changepassword = async (data, callback) => {
        try {
            await csrf();
            setIsLoading(false);
            await axios.post('/api/change-password', data);
            setIsLoading(true);
            await logout();
            setStatus("Change Password Success");
            callback();
        } catch (error) {
            setIsLoading(true);
            console.log(error.response.data.errors);
            if (error.response.status === 422) {
                setErrors(error.response.data.errors);
            }
        }
    };

    useEffect(() => {
        if (!currentUser) {
            getUser();
        }
    }, [currentUser, getUser])

    return <AuthContext.Provider value={{ currentUser, errors, getUser, login, logout, register, csrf, isLoading, changepassword, status }}>
        {children}
    </AuthContext.Provider>;

}

export default function useAuthContext() {
    return useContext(AuthContext);
}