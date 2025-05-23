import { createContext, useState, useEffect, useContext } from "react";
import Cookies from 'js-cookie';

//////////////////////////////////////////////
//// CREATING CONTEXT ////
//////////////////////////////////////////////
const AuthContext = createContext();
export default AuthContext;

const AUTH_KEY = import.meta.env.VITE_AUTH_KEY;
const TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY;
const STORE_KEY = import.meta.env.VITE_STORE_KEY;

//////////////////////////////////////////////
//// CREATING PROVIDER ////
//////////////////////////////////////////////
export const AuthProvider = function({ children }) {
    const [shouldLoadAll, setShouldLoadAll] = useState(true); // helps tell when not to load all
    const [user, setUser] = useState(Cookies.get(AUTH_KEY) ? JSON.parse(Cookies.get(AUTH_KEY)) : null);
    const [token, setToken] = useState(Cookies.get(TOKEN_KEY) ? Cookies.get(TOKEN_KEY) : null);
    const [store, setStore] = useState(Cookies.get(STORE_KEY) ? JSON.parse(Cookies.get(STORE_KEY)) : null);

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    }
    const formdataHeader = { Authorization: `Bearer ${token}` }
    const currency = store?.currency?.symbol;

    function handleChange(user, token) {
        setShouldLoadAll(true);
        setUser(user);
        setToken(token);
    };

    function handleUser(user) {
        setUser(user);
    };

    function handleStore(store) {
        setStore(store);
    };

    async function signoutUser() {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, { headers });
            const data = res.json({})
            if(res.status === 429) throw new Error("Too Many Requests, Try again later")
            if(data.status == "fail" || !res.ok) throw new Error(data?.message);

            setTimeout(function() {
                handleChange(null, null);
                handleStore(null)
            }, 1000);

            return "successful";

        } catch(err) {
            return err?.message
        }
    }

    function shouldKick(res) {
        if (res?.status === 401 || res?.status === 403) {
            handleChange(null, null);
            handleStore(null)
        }
    };

    useEffect(function () {
        Cookies.set(AUTH_KEY, JSON.stringify(user), { expires: 365 });
        Cookies.set(TOKEN_KEY, token, { expires: 365 });
        Cookies.set(STORE_KEY, JSON.stringify(store), { expires: 365 });
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
        shouldLoadAll,
        setShouldLoadAll
    }

    return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
}


//////////////////////////////////////////////
//// CREATING HOOK AND EXPORTING ////
//////////////////////////////////////////////
export const useAuthContext = () => useContext(AuthContext);