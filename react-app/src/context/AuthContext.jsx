import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [errors, setError] = useState([]);
    const navigate = useNavigate();
    const csrf = () => axios.get("/sanctum/csrf-cookie");

    const getUser = async () => {
        const { data } = await axios.get("/api/user");
        setUser(data);
    }
    const login = async ({ ...data }) => {
        await csrf();
        try {
            await axios.post('/login', { ...data })
            await getUser();
            navigate("/")
        } catch (e) {
            if (e.response.status === 422) {
                setError(e.response.data.errors)
            }
            console.log(e)
        }
    }
    const register = async ({ ...data }) => {
        await csrf();
        try {
            await axios.post('/register', { ...data })
            await getUser();
            navigate("/")
        } catch (e) {
            if (e.response.status === 422) {
                setError(e.response.data.errors)
            }
            else if (e.response.status === 500) {
                setError(e.response.data.errors)
            }
            // console.log(e)
        }
    }
    const logout = () => {
        axios.post("/logout").then(() => {
            setUser(null);
            navigate("/login")
        });

    }
    useEffect(() => {
        if (!user) {
            getUser();
        }
    }, [])
    return <AuthContext.Provider value={{ user, errors, getUser, login, logout, register, csrf }}>
        {children}
    </AuthContext.Provider>
}

export default function useAuthContext() {
    return useContext(AuthContext);
}