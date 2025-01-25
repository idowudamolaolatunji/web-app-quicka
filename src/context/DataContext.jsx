import { createContext, useState, useEffect, useContext } from "react";
import { useLocation, useWindowSize } from "react-use";
import { useAuthContext } from "./AuthContext";


//////////////////////////////////////////////
//// CREATING CONTEXT ////
//////////////////////////////////////////////
const DataContext = createContext();
export default DataContext;

const PRODUCT_TAB_KEY = import.meta.env.VITE_PRODUCT_DISPLAY_STYLE_KEY;
const MENU_COLLAPSED_KEY = import.meta.env.VITE_MENU_COLLAPSED_KEY;
const SHOW_INSIGHTS_KEY = import.meta.env.VITE_SHOW_INSIGHTS_KEY;


//////////////////////////////////////////////
//// CREATING PROVIDER ////
//////////////////////////////////////////////
export const DataProvider = ({ children }) => {
    const { pathname } = useLocation();
    const { width } = useWindowSize();
    const isMobile = width <= 650 ? true : false

    const { store } = useAuthContext();
    const currencyName = store?.currency?.name;

    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    const [animateOut, setAnimateOut] = useState(false);
    const [showSidemenu, setShowSidemenu] = useState(false);
    const [location, setLocation] = useState({ country: [], state: [], city: [] });
    const [showFilterModal, setShowFilterModal] = useState({ name: "", isShown: false });
    ////////////////////////////////////////////////////////////////////////////////////////
    const [isMenuCollapsed, setIsMenuCollapsed] = useState(localStorage.getItem(MENU_COLLAPSED_KEY) ? JSON.parse(localStorage.getItem(MENU_COLLAPSED_KEY)) : false);
    const [activeDisplayTab, setActiveDisplayTab] = useState(localStorage.getItem(PRODUCT_TAB_KEY) ? JSON.parse(localStorage.getItem(PRODUCT_TAB_KEY)) : "table");
    const [showInsights, setShowInsights] = useState(
        localStorage.getItem(SHOW_INSIGHTS_KEY) ? JSON.parse(localStorage.getItem(SHOW_INSIGHTS_KEY)) : {
        product: isMobile,
        order: isMobile,
        customer: isMobile,
        transaction: isMobile,
        campaign: isMobile,
        discount: isMobile
    });

    
    const handleToggleFilter = function(pageName) {
        setShowFilterModal({ name: pageName, isShown: !showFilterModal.isShown });
    }

    const handleDisplayTab = function(type) {
        setActiveDisplayTab(type)
    }

    const handleMenuCollapse = function() {
        setIsMenuCollapsed(!isMenuCollapsed);
    }

    const closeNanimate = function() {
        setAnimateOut(true);
        setTimeout(() => {
            setAnimateOut(false);
            setShowSidemenu(false);
        }, 300);
    }

    const handleShowSidemenu = function() {
        if(!showSidemenu) {
            setShowSidemenu(true);
        } else {
            closeNanimate();
        }
    }

    const handleToggleInsights = function(name) {
        setShowInsights({
            ...showInsights,
            [name]: !showInsights[name]
        })
    }


    useEffect(function() {
        if(width <= 1100) {
            setIsMenuCollapsed(true);
        } else {
            setIsMenuCollapsed(false);
        }
    }, [width]);


    // useEffect(function() {
    //     if(width <= 450) {
    //         setActiveDisplayTab("grid")
    //     } else {
    //         setActiveDisplayTab("table");
    //     }
    // }, [width])


    useEffect(function() {
        closeNanimate();
    }, [pathname]);


    useEffect(function() {
        localStorage.setItem(MENU_COLLAPSED_KEY, JSON.stringify(isMenuCollapsed));
    }, [isMenuCollapsed]);

    useEffect(function() {
        localStorage.setItem(SHOW_INSIGHTS_KEY, JSON.stringify(showInsights))
    }, [showInsights]);

    useEffect(function() {
        localStorage.setItem(PRODUCT_TAB_KEY, JSON.stringify(activeDisplayTab))
    }, [activeDisplayTab]);



    async function handleFetchBanks() {
        try {
            const response = await fetch(`https://api.paystack.co/bank?currency=${currencyName}`);
            const data = await response.json();
            if (!data.status) throw new Error(data.message);
            return data;
        } catch(err) {
            return err;
        }
    }


    async function handleResolveAccount(accountNumber, code) {
        try {
            const response = await fetch(`https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${code}&currency=${currencyName}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (!data.status) throw new Error(data.message);
            return data;
        } catch(err) {
            return err;
        }
    }


    // COUNTRY AND LOCATION API (COUNTRY, STATE, CITY)
    const apiBaseUrl = "https://api.countrystatecity.in/v1/countries";
    const apiToken = "Q0lMUm00U1NFcnFQN1V1MlRwaHR3aUpwQWZ0SVV0MU9lS0JsY0hDQQ==";
    const headers = new Headers();
    headers.append("X-CSCAPI-KEY", apiToken);

    const getContries = async function() {
        const response = await fetch(apiBaseUrl, { headers });
        const data = await response.json();
        setLocation({...location, country: [...data] })
    };

    const getStates = async function(selectedCountryCode) {
        const response = await fetch(`${apiBaseUrl}/${selectedCountryCode}/states`, { headers });
        const data = await response.json();
        setLocation({...location, state: [...data] })
    };

    const getCities = async function(selectedCountryCode, selectedStateCode) {
        const response = await fetch(`${apiBaseUrl}/${selectedCountryCode}/states/${selectedStateCode}/cities`, { headers });
        const data = await response.json();
        setLocation({...location, city: [...data] })
    };
    ////////////////////////////////////////////////////////
    
    

    // CREATE CONTEXT DATA
    let contextData = {
        isMenuCollapsed,
        handleMenuCollapse,

        showSidemenu,
        setShowSidemenu,
        handleShowSidemenu,
        animateOut,

        handleToggleInsights,
        showInsights,
        showFilterModal,
        handleToggleFilter,

        activeDisplayTab,
        handleDisplayTab,

        location,
        setLocation,
        getContries,
        getStates,
        getCities,

        handleFetchBanks,
        handleResolveAccount
    }


    return <DataContext.Provider value={contextData}>{children}</DataContext.Provider>
}


//////////////////////////////////////////////
//// CREATING HOOK AND EXPORTING ////
//////////////////////////////////////////////
export const useDataContext = () => useContext(DataContext);