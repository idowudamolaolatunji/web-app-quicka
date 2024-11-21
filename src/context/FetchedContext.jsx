import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
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
    const [orderError, setOrderError] = useState(false);
    const [productError, setProductError] = useState(false);
    const [deliveryError, setDeliveryError] = useState(false);
    const [customerError, setCustomerError] = useState(false);
    const [collectionError, setCollectionError] = useState(false);
    const [transactionError, setTransactionError] = useState(false);

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
    const globalInternetError = (orderError || productError || transactionError || collectionError || customerError || deliveryError);

    const handleGlobalRefetch = function() {
        handleFetchStore()
        handleFetchUserStoreOrders();
        handleFetchUserStoreProducts();
        handleFetchUserStoreCustomers()
        handleFetchUserStoreTransactions();
        handleFetchUserStoreCollections();
        handleFetchUserStoreDeliveryRates();
    }


    async function handleFetchItem(title, id) {
        const ifProduct = title == "product" ? "slug/id/" : "";
        const url = `${import.meta.env.VITE_API_URL}/${title}s/${ifProduct}${id}`;
        const res = await fetch(url);
        shouldKick();
        
        const data = await res.json();
        return data?.data[title];
    }


    // FETCH UNPROTECTED STORE CATEGORIES
    async function handleFetchStoreCategories() {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/stores/category`);
            shouldKick(res);
            const data = await res.json();
            setStoreCategories(data.data.categories);
        } catch (err) {
            console.log(err.message);
        }
    }

    // FETCH PROTECTED STORE data
    async function handleFetchStore() {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/stores/mine/store`, { method: "GET", headers });
            shouldKick(res);

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
            setCollectionError(false);
            setCollectionLoader(true);
            setCollections([]);

            const res = await fetch(`${BASE_API_URL}/collections/mine/collections`, { method: "GET", headers })
            shouldKick(res);

            const data = await res.json();
            if(data.status == "fail") throw new Error();
            if (data?.data) setCollections(data?.data?.collections);
        } catch(err) {
            setCollectionError(true);
        } finally {
            setCollectionLoader(false);
        }
    }


    // FETCH PROTECTED STORE PRODUCTS
    async function handleFetchUserStoreProducts() {
        try {
            setProductError(false);
            setProductLoader(true);
            setProducts([]);

            const res = await fetch(`${BASE_API_URL}/products/mine/products`, { method: "GET", headers });
            shouldKick(res);

            const data = await res.json();
            if(data.status == "fail") throw new Error();
            if (data?.data) setProducts(data?.data?.products);
        } catch (err) {
            setProductError(true);
        } finally {
            setProductLoader(false);
        }
    }


    // FETCH PROTECTED STORE SALES AND ORDERS
    async function handleFetchUserStoreOrders() {
        try {
            setOrderError(false);
            setOrderLoader(true);
            setOrders([]);

            const res = await fetch(`${BASE_API_URL}/orders/mine/orders`, { method: "GET", headers });
            shouldKick(res);

            const data = await res.json();
            if(data.status == "fail") throw new Error();
            if (data?.data) setOrders(data?.data?.orders);
        } catch (err) {
            setOrderError(true);
        } finally {
            setOrderLoader(false);
        }

    }


    // FETCH PROTECTED STORE CUSTOMERS
    async function handleFetchUserStoreCustomers() {
        try {
            setCustomerError(false);
            setCustomerLoader(true);
            setCustomers([]);

            const res = await fetch(`${BASE_API_URL}/customers/mine/customers`, { method: "GET", headers });
            shouldKick(res);

            const data = await res.json();
            if(data.status == "fail") throw new Error();
            if (data?.data) setCustomers(data?.data?.customers);
        } catch (err) {
            setCustomerError(true);
        } finally {
            setCustomerLoader(false);
        }
    }


    // FETCH PROTECTED STIRE DELIVERY RATES
    async function handleFetchUserStoreDeliveryRates () {
        try {
            setDeliveryError(false);
            setDeliveryLoader(true);
            setDeliveryRates([]);

            const res = await fetch(`${BASE_API_URL}/delivery-rates/mine/delivery-rates`, { method: "GET", headers });
            shouldKick(res);

            const data = await res.json();
            if(data.status == "fail") throw new Error();
            if (data?.data) setDeliveryRates(data?.data?.rates);
        } catch (err) {
            setDeliveryError(true);
        } finally {
            setDeliveryLoader(false);
        }
    }


    // FETCH PROTECTED STORE SALES TRANSACTIONS
    async function handleFetchUserStoreTransactions () {
        try {
            setTransactionError(false);
            setTransactionLoader(true);
            setTransactions([]);

            const res = await fetch(`${BASE_API_URL}/transactions/mine/transactions`, { method: "GET", headers });
            shouldKick(res);

            const data = await res.json();
            if(data.status == "fail") throw new Error();
            if (data?.data) setTransactions(data?.data?.transactions);
        } catch (err) {
            setTransactionError(true);
        } finally {
            setTransactionLoader(false);
        }
    }

    
    async function handleDeleteOneItem(title, id) {
        await fetch(`${BASE_API_URL}/${title}/${id}`, { method: "DELETE", headers });
    }


    async function handleMultipleImageUpload(Imgfiles, url) {
        const formData = new FormData();
        if (Array.isArray(Imgfiles)) {
            for (let i = 0; i < Imgfiles.length; i++) {
                console.log(Imgfiles[i])
                formData.append("images", Imgfiles[i]);
            }
        }

        const res = await fetch(`${BASE_API_URL}/${url}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData,
        });

        shouldKick(res);
        if (!res.ok) return 'Something went wrong!';

        const data = await res.json();
        console.log(data, res)
    }


    async function handleImageUpload(Imgfile, url, tk=null) {
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

        if (!res.ok) return 'Something went wrong!';
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