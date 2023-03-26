import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from 'react-loading-overlay';
import axios from "../api/axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [errors, setError] = useState({});
    const [status, setStatus] = useState([]);
    const [permission, setPermission] = useState([]);

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const csrf = () => axios.get("/sanctum/csrf-cookie");

    const getUser = async () => {
        const { data } = await axios.get("/api/user");
        setUser(data);
        if (data.roles === "admin") {
            navigate("/admin");
        }
    }

    const login = async ({ ...data }, callback) => {
        await csrf();
        let resolve;
        const promise = new Promise((r) => {
            resolve = r;
        });
        setIsLoading(true);
        try {
            await axios.post('/login', { ...data })
            await getUser();
            setIsLoading(false);
            navigate("/")
            resolve();
            callback();
        } catch (e) {
            setIsLoading(false);
            if (e.response.status === 422) {
                setError(e.response.data.errors);
            }
            if (e.response.status === 401) {
                setError("Invalid email or password");
            }
        }
        return promise;
    }

    const register = async ({ ...data }, callback) => {
        await csrf();
        let resolve;
        const promise = new Promise((r) => {
            resolve = r;
        });
        setIsLoading(false);
        try {
            await axios.post('/register', { ...data })
            setIsLoading(true);
            await getUser();
            navigate("/")
            // setStatus("Register successfully");
            resolve();
            callback();
        } catch (e) {
            setIsLoading(false);
            if (e.response.status === 422) {
                setError(e.response.data.errors)
            }
            else if (e.response.status === 500) {
                setError(e.response.data.errors)
            }
        }
        return promise;
    }

    const logout = () => {
        // Gửi request để đăng xuất người dùng
        axios.post('/logout')
            .then(() => {
                // Nếu đăng xuất thành công, chuyển hướng về trang đăng nhập
                setUser(null);
                navigate("/login")
            })
            .catch((error) => {
                // Nếu có lỗi, hiển thị thông báo lỗi
                console.log(error);
            });
    }
    const changepassword = async ({ ...data }, callback) => {
        await csrf();
        let resolve;
        const promise = new Promise((r) => {
            resolve = r;
        });
        setIsLoading(true);
        try {
            await axios.post('/api/v1/change-password', { ...data });
            setIsLoading(false);
            logout();
            setStatus("Change Password Success");
            resolve();
            callback();

        } catch (e) {
            setIsLoading(false);
            console.log(e.response.data.errors);
            if (e.response.status === 422) {
                setError(e.response.data.errors)
            }
        }
        return promise;
    }

    useEffect(() => {
        if (!user) {
            getUser();
        }
    }, [])

    return <AuthContext.Provider value={{ user, errors, getUser, login, logout, register, csrf, isLoading, changepassword, status }}>
        {children}
    </AuthContext.Provider>
}

export default function useAuthContext() {
    return useContext(AuthContext);
}

