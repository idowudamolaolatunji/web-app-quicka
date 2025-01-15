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
    const [user, setUser] = useState(Cookies.get('q_user_obj') ? JSON.parse(Cookies.get('q_user_obj')) : null);
    const [token, setToken] = useState(Cookies.get('q_user_jwt_token') ? Cookies.get('q_user_jwt_token') : null);
    const [store, setStore] = useState(Cookies.get("q_user_store") ? JSON.parse(Cookies.get("q_user_store")) : null);

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    }
    const fdHeaders = { Authorization: `Bearer ${token}` }

    // const { currencies, mainCurrency } = store;
    const currencies = store?.currencies || [];
    const mainCurrency = store?.mainCurrency || 0;
    const currency = currencies[mainCurrency]?.symbol;

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

    // function destroyCookie() {
        // Cookies.remove("q_user_obj");
        // Cookies.remove("q_user_jwt_token");
        // Cookies.remove("q_user_store");
    // }

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
        Cookies.set("q_user_obj", JSON.stringify(user), { expires: 365 });
        Cookies.set("q_user_jwt_token", token, { expires: 365 });
        Cookies.set("q_user_store", JSON.stringify(store), { expires: 365 });
    }, [user, token, store]);

    // CREATE CONTEXT DATA
    let contextData = {
        user,
        token,
        headers,
        fdHeaders,
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