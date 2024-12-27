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
    const [user, setUser] = useState(Cookies.get('q_user_obj') == null ? null : JSON.parse(Cookies.get('q_user_obj')));
    const [token, setToken] = useState(Cookies.get('q_user_jwt_token') == null ? null : Cookies.get('q_user_jwt_token'));
    const [store, setStore] = useState(Cookies.get("q_user_store") == null ? null : JSON.parse(Cookies.get("q_user_store")));

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    }

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
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/logout`);
        if (!res.ok) return false;

        setTimeout(function() {
            handleChange(null, null);
            Cookies.remove("q_user_obj");
            Cookies.remove("q_user_jwt_token");
            Cookies.remove("q_user_store");
        }, 2500);

        return true
    }

    function shouldKick(res) {
        if (res?.status === 401 || res?.status === 403) {
            Cookies.remove("q_user_obj");
            Cookies.remove("q_user_jwt_token");
            Cookies.remove("q_user_store");
            window.location.href = "/login";
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
        handleChange,
        handleUser,
        signoutUser,
        shouldKick,
        store,
        handleStore,
    }

    return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
}


//////////////////////////////////////////////
//// CREATING HOOK AND EXPORTING ////
//////////////////////////////////////////////
export const useAuthContext = () => useContext(AuthContext);