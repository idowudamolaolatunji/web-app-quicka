import { createContext, useState, useEffect, useContext } from "react";
import { useLocation, useWindowSize } from "react-use";


//////////////////////////////////////////////
//// CREATING CONTEXT ////
//////////////////////////////////////////////
const DataContext = createContext();
export default DataContext;


//////////////////////////////////////////////
//// CREATING PROVIDER ////
//////////////////////////////////////////////
export const DataProvider = ({ children }) => {
    const [isMenuCollapsed, setIsMenuCollapsed] = useState(localStorage.getItem("menu_collapsed") ? JSON.parse(localStorage.getItem("menu_collapsed")) : false);

    const [showSidemenu, setShowSidemenu] = useState(false);
    const [animateOut, setAnimateOut] = useState(false);

    const [activeDisplayTab, setActiveDisplayTab] = useState(localStorage.getItem("p_active_tab") ? JSON.parse(localStorage.getItem("p_active_tab")) : "table");

    const [showInsights, setShowInsights] = useState(
        localStorage.getItem("show_ins") ? JSON.parse(localStorage.getItem("show_ins")) : {
        product: false,
        order: false,
        customer: false,
        transaction: false
    });

    const [location, setLocation] = useState({
        country: [],
        state: [],
        city: [],
    });

    const { pathname } = useLocation();
    const { width } = useWindowSize();

    const handleDisplayTab = function(type) {
        setActiveDisplayTab(type)
    }

    function handleMenuCollapse() {
        setIsMenuCollapsed(!isMenuCollapsed);
    }

    function closeNanimate() {
        setAnimateOut(true);
        setTimeout(() => {
            setAnimateOut(false);
            setShowSidemenu(false);
        }, 300);
    }

    function handleShowSidemenu() {
        if(!showSidemenu) {
            setShowSidemenu(true);
        } else {
            closeNanimate();
        }
    }


    function handleToggleInsights(name) {
        setShowInsights({
            ...showInsights,
            [name]: !showInsights[name]
        })
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
    // //////////////////////////////////////////////////////


    useEffect(function() {
        if(width <= 1100) {
            setIsMenuCollapsed(true);
        } else {
            setIsMenuCollapsed(false);
        }
    }, [width]);


    useEffect(function() {
        if(width <= 450) {
            setActiveDisplayTab("grid")
        }
    }, [width])


    useEffect(function() {
        closeNanimate();
    }, [pathname]);


    useEffect(function() {
        localStorage.setItem("menu_collapsed", JSON.stringify(isMenuCollapsed));
    }, [isMenuCollapsed]);

    useEffect(function() {
        localStorage.setItem("show_ins", JSON.stringify(showInsights))
    }, [showInsights]);

    useEffect(function() {
        localStorage.setItem("p_active_tab", JSON.stringify(activeDisplayTab))
    }, [activeDisplayTab]);

    

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

        activeDisplayTab,
        handleDisplayTab,

        location,
        setLocation,
        getContries,
        getStates,
        getCities
    }


    return <DataContext.Provider value={contextData}>{children}</DataContext.Provider>
}


//////////////////////////////////////////////
//// CREATING HOOK AND EXPORTING ////
//////////////////////////////////////////////
export const useDataContext = () => useContext(DataContext);