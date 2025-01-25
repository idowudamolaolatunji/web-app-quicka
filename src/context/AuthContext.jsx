import { createContext, useState, useEffect, useContext } from "react";
import Cookies from 'js-cookie';

//////////////////////////////////////////////
//// CREATING CONTEXT ////
//////////////////////////////////////////////
const AuthContext = createContext();
export default AuthContext;


//////////////////////////////////////////////
//// CREATING PROVIDER ////
//////////////////////////////////////////////
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(Cookies.get('q_auth') ? JSON.parse(Cookies.get('q_auth')) : null);
    const [token, setToken] = useState(Cookies.get('q_token') ? Cookies.get('q_token') : null);
    const [store, setStore] = useState(Cookies.get("q_store") ? JSON.parse(Cookies.get("q_store")) : null);

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    }
    const formdataHeader = { Authorization: `Bearer ${token}` }

    const currency = store?.currency?.symbol;

    function handleChange(user, token) {
        setUser(user);
        setToken(token);
    };

    function handleUser(user) {
        setUser(user);
    };

    function handleStore(store) {
        setStore(store);
    }

    async function signoutUser() {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`);
        if (!res.ok) return false;

        setTimeout(function() {
            handleChange(null, null);
            handleStore(null)
        }, 2500);

        return true
    }

    function shouldKick(res) {
        if (res?.status === 401 || res?.status === 403) {
            handleChange(null, null);
            handleStore(null)
        }
    };

    useEffect(function () {
        Cookies.set("q_auth", JSON.stringify(user), { expires: 365 });
        Cookies.set("q_token", token, { expires: 365 });
        Cookies.set("q_store", JSON.stringify(store), { expires: 365 });
    }, [user, token, store]);

    // CREATE CONTEXT DATA
    let contextData = {
        user,
        token,
        headers,
        formdataHeader,
        handleChange,
        handleUser,
        signoutUser,
        shouldKick,
        store,
        currency,
        handleStore,
    }

    return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
}


//////////////////////////////////////////////
//// CREATING HOOK AND EXPORTING ////
//////////////////////////////////////////////
export const useAuthContext = () => useContext(AuthContext);