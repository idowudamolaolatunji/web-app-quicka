import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import isOnline from "is-online";
const BASE_API_URL = import.meta.env.VITE_API_URL;


//////////////////////////////////////////////
//// CREATING CONTEXT ////
//////////////////////////////////////////////
const FetchedContext = createContext();
export default FetchedContext;


//////////////////////////////////////////////
//// CREATING PROVIDER ////
//////////////////////////////////////////////
export const FetchedProvider = ({ children }) => {
    const { token, user, shouldKick, headers, handleUser, handleStore } = useAuthContext();

    // DOCUMENT STATES
    const [collections, setCollections] = useState([]);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [deliveryRates, setDeliveryRates] = useState([]);
    const [storeCategories, setStoreCategories] = useState([]);
    const [transactions, setTransactions] = useState([]);

    // LOADER STATES
    const [orderLoader, setOrderLoader] = useState(true);
    const [productLoader, setProductLoader] = useState(true);
    const [deliveryLoader, setDeliveryLoader] = useState(true);
    const [customerLoader, setCustomerLoader] = useState(true);
    const [collectionLoader, setCollectionLoader] = useState(true);
    const [transactionLoader, setTransactionLoader] = useState(true);

    // ERROR STATES
    const [orderError, setOrderError] = useState("");
    const [productError, setProductError] = useState("");
    const [deliveryError, setDeliveryError] = useState("");
    const [customerError, setCustomerError] = useState("");
    const [collectionError, setCollectionError] = useState("");
    const [transactionError, setTransactionError] = useState("");

    // SETTING LOADER THIS WAY IS BETTER THAN THE PREVIOUS
    const loader = {
        order: orderLoader,
        product: productLoader,
        delivery: deliveryLoader,
        customer: customerLoader,
        collection: collectionLoader,
        transaction: transactionLoader,
    }
    const error = {
        order: orderError,
        product: productError,
        delivery: deliveryError,
        customer: customerError,
        collection: collectionError,
        transaction: transactionError,
    }

    // GLOBAL ERROR & GLOBAL REFETCH
    const internetErrorStr = "Check Internet Connection"
    const serverErrorStr = "Server"
    const globalInternetError = (
        orderError.includes(internetErrorStr) ||
        productError.includes(internetErrorStr) ||
        transactionError.includes(internetErrorStr) ||
        collectionError.includes(internetErrorStr) ||
        customerError.includes(internetErrorStr) ||
        deliveryError.includes(internetErrorStr)
    ) ? true : false;

    const globalServerError = (
        orderError.includes(serverErrorStr) ||
        productError.includes(serverErrorStr) ||
        transactionError.includes(serverErrorStr) ||
        collectionError.includes(serverErrorStr) ||
        customerError.includes(serverErrorStr) ||
        deliveryError.includes(serverErrorStr)
    ) ? true : false;


    const handleGlobalRefetch = function() {
        handleFetchStore()
        handleFetchUserStoreOrders();
        handleFetchUserStoreProducts();
        handleFetchUserStoreCustomers()
        handleFetchUserStoreTransactions();
        handleFetchUserStoreCollections();
        handleFetchUserStoreDeliveryRates();
    }

    const handleFetchError = function(errMessage) {
        let message;
        if (errMessage?.includes("Failed to fetch") || errMessage?.includes("CONNECTION")) {
            message = "Server is Busy, Please try again later.";
        } else if (errMessage?.includes("Internet Error")) {
            message = "Unable to fetch, Check Internet Connection.";
        } else {
            message = errMessage || "An error occurred. Please try again later";
        }
        return message;
    }


    async function handleFetchItem(title, id) {
        const ifProduct = title == "product" ? "slug/id/" : "";
        const url = `${import.meta.env.VITE_API_URL}/${title}s/${ifProduct}${id}`;
        const res = await fetch(url);
        
        const data = await res.json();
        return data?.data[title];
    }


    // FETCH UNPROTECTED STORE CATEGORIES
    async function handleFetchStoreCategories() {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/stores/category`);
            const data = await res.json();
            setStoreCategories(data.data.categories);
        } catch (err) {
            console.log(err.message);
        }
    }

    // FETCH PROTECTED STORE data
    async function handleFetchStore() {
        try {
            const isConnected = await isOnline();
            if(!isConnected) throw new Error("Check your internet connection");

            const res = await fetch(`${import.meta.env.VITE_API_URL}/stores/mine/store`, { method: "GET", headers });
            const data = await res.json();
            handleStore(data?.data?.store);
            handleUser(data?.data?.user);
        } catch (err) {
            console.log(err.message);
        }
    }


    // FETCH PROTECTED STORE COLLECTION
    async function handleFetchUserStoreCollections() {
        try {
            setCollectionError("");
            setCollectionLoader(true);
            setCollections([]);

            const isConnected = await isOnline();
            if(!isConnected) throw new Error("Internet Error");

            const res = await fetch(`${BASE_API_URL}/collections/mine/collections`, { method: "GET", headers })
            shouldKick(res);

            const data = await res.json();
            if(data.status == "fail") throw new Error();
            if (data?.data) setCollections(data?.data?.collections);
        } catch(err) {
            const errMessage = handleFetchError(err?.message)
            setCollectionError(errMessage);
        } finally {
            setCollectionLoader(false);
        }
    }


    // FETCH PROTECTED STORE PRODUCTS
    async function handleFetchUserStoreProducts() {
        try {
            setProductError("");
            setProductLoader(true);
            setProducts([]);

            const isConnected = await isOnline();
            if(!isConnected) throw new Error("Internet Error");

            const res = await fetch(`${BASE_API_URL}/products/mine/products`, { method: "GET", headers });
            shouldKick(res);


            const data = await res.json();
            if(data.status == "fail") throw new Error();
            if (data?.data) setProducts(data?.data?.products);
        } catch (err) {
            const errMessage = handleFetchError(err?.message)
            setProductError(errMessage);
        } finally {
            setProductLoader(false);
        }
    }


    // FETCH PROTECTED STORE SALES AND ORDERS
    async function handleFetchUserStoreOrders() {
        try {
            setOrderError("");
            setOrderLoader(true);
            setOrders([]);

            const isConnected = await isOnline();
            if(!isConnected) throw new Error("Internet Error");

            const res = await fetch(`${BASE_API_URL}/orders/mine/orders`, { method: "GET", headers });
            shouldKick(res);

            const data = await res.json();
            if(data.status == "fail") throw new Error();
            if (data?.data) setOrders(data?.data?.orders);
        } catch (err) {
            const errMessage = handleFetchError(err?.message)
            setOrderError(errMessage);
        } finally {
            setOrderLoader(false);
        }

    }


    // FETCH PROTECTED STORE CUSTOMERS
    async function handleFetchUserStoreCustomers() {
        try {
            setCustomerError("");
            setCustomerLoader(true);
            setCustomers([]);

            const isConnected = await isOnline();
            if(!isConnected) throw new Error("Internet Error");

            const res = await fetch(`${BASE_API_URL}/customers/mine/customers`, { method: "GET", headers });
            shouldKick(res);

            const data = await res.json();
            if(data.status == "fail") throw new Error();
            if (data?.data) setCustomers(data?.data?.customers);
        } catch (err) {
            const errMessage = handleFetchError(err?.message)
            setCustomerError(errMessage);
        } finally {
            setCustomerLoader(false);
        }
    }


    // FETCH PROTECTED STIRE DELIVERY RATES
    async function handleFetchUserStoreDeliveryRates () {
        try {
            setDeliveryError("");
            setDeliveryLoader(true);
            setDeliveryRates([]);

            const isConnected = await isOnline();
            if(!isConnected) throw new Error("Internet Error");

            const res = await fetch(`${BASE_API_URL}/delivery-rates/mine/delivery-rates`, { method: "GET", headers });
            shouldKick(res);

            const data = await res.json();
            if(data.status == "fail") throw new Error();
            if (data?.data) setDeliveryRates(data?.data?.rates);
        } catch (err) {
            const errMessage = handleFetchError(err?.message)
            setDeliveryError(errMessage);
        } finally {
            setDeliveryLoader(false);
        }
    }


    // FETCH PROTECTED STORE SALES TRANSACTIONS
    async function handleFetchUserStoreTransactions () {
        try {
            setTransactionError("");
            setTransactionLoader(true);
            setTransactions([]);

            const isConnected = await isOnline();
            if(!isConnected) throw new Error("Internet Error");

            const res = await fetch(`${BASE_API_URL}/transactions/mine/transactions`, { method: "GET", headers });
            shouldKick(res);

            const data = await res.json();
            if(data.status == "fail") throw new Error();
            if (data?.data) setTransactions(data?.data?.transactions);

        } catch (err) {
            const errMessage = handleFetchError(err?.message)
            setTransactionError(errMessage)
        } finally {
            setTransactionLoader(false);
        }
    }

    
    async function handleDeleteOneItem(title, id) {
        await fetch(`${BASE_API_URL}/${title}/${id}`, { method: "DELETE", headers });
    }


    async function handleMultipleImageUpload(Imgfiles, url, method="POST", updatedIndexes) {
        const isConnected = await isOnline();
        if(!isConnected) throw new Error("Check your internet connection!");

        const formData = new FormData();
        if (Array.isArray(Imgfiles)) {
            for (let i = 0; i < Imgfiles.length; i++) {
                console.log(Imgfiles[i])
                formData.append("images", Imgfiles[i]);
            }
        }

        if(updatedIndexes) {
            formData.append("updatedIndexes", JSON.stringify(updatedIndexes));
        }

        const res = await fetch(`${BASE_API_URL}/${url}`, {
            method, headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData,
        });

        shouldKick(res);
        
        const data = await res.json();
        return data;
    }
    
    
    async function handleImageUpload(Imgfile, url, tk=null) {
        const isConnected = await isOnline();
        if(!isConnected) throw new Error("Check your internet connection!");


        console.log(Imgfile, url, tk);
        const formData = new FormData();
        formData.append("image", Imgfile);
        
        
        const res = await fetch(`${BASE_API_URL}/${url}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${tk || token}`
            },
            body: formData,
        });
        shouldKick(res);

        const data = await res.json();
        return data
    }

    
    useEffect(function () {
        setCollections([]);
        setProducts([]);
        setOrders([]);
        setCustomers([]);
        setDeliveryRates([]);
        setTransactions([]);

        if(token && user) {
            handleFetchUserStoreOrders();
            handleFetchUserStoreProducts();
            handleFetchUserStoreCustomers();
            handleFetchUserStoreCollections();
            handleFetchUserStoreDeliveryRates();
            handleFetchUserStoreTransactions();
        }
    }, [token, user])


    // CREATE CONTEXT DATA
    let contextData = {
        error,
        loader,
        globalServerError,
        globalInternetError,
        handleGlobalRefetch,
        
        orders,
        products,
        customers,
        collections,
        transactions,
        deliveryRates,
        handleFetchUserStoreOrders,
        handleFetchUserStoreProducts,
        handleFetchUserStoreCustomers,
        handleFetchUserStoreCollections,
        handleFetchUserStoreTransactions,
        handleFetchUserStoreDeliveryRates,
        //////////////////////////////////
        
        storeCategories,
        handleImageUpload,
        handleMultipleImageUpload,
        handleFetchStoreCategories,
        ///////////////////////////

        handleFetchItem,
        handleDeleteOneItem,
    }


    return <FetchedContext.Provider value={contextData}>{children}</FetchedContext.Provider>
}


//////////////////////////////////////////////
//// CREATING HOOK AND EXPORTING ////
//////////////////////////////////////////////
export const useFetchedContext = () => useContext(FetchedContext);