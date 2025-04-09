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
    const { token, user, shouldKick, headers, handleStore } = useAuthContext();

    // DOCUMENT STATES
    const [collections, setCollections] = useState([]);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [deliveryRates, setDeliveryRates] = useState([]);
    const [storeCategories, setStoreCategories] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [settlements, setSettlements] = useState([]);
    const [special_sales, setspecial_sales] = useState([]);

    // LOADER STATES
    const [storeLoader, setStoreLoader] = useState(true);
    const [orderLoader, setOrderLoader] = useState(true);
    const [productLoader, setProductLoader] = useState(true);
    const [deliveryLoader, setDeliveryLoader] = useState(true);
    const [customerLoader, setCustomerLoader] = useState(true);
    const [collectionLoader, setCollectionLoader] = useState(true);
    const [transactionLoader, setTransactionLoader] = useState(true);
    const [campaignLoader, setCampaignLoader] = useState(false);
    const [couponLoader, setCouponLoader] = useState(false);
    const [discountLoader, setDiscountLoader] = useState(false);
    const [storeSaleLoader, setStoreSaleLoader] = useState(false);
    const [settlementLoader, setSettlementLoader] = useState(false);

    // ERROR STATES
    const [orderError, setOrderError] = useState("");
    const [productError, setProductError] = useState("");
    const [deliveryError, setDeliveryError] = useState("");
    const [customerError, setCustomerError] = useState("");
    const [collectionError, setCollectionError] = useState("");
    const [transactionError, setTransactionError] = useState("");
    const [campaignError, setCampaignError] = useState("");
    const [discountError, setDiscountError] = useState("");
    const [couponError, setCouponError] = useState("");
    const [storeSaleError, setStoreSaleError] = useState("");
    const [settlementError, setSettlementError] = useState("");

    // SETTING LOADER THIS WAY IS BETTER THAN THE PREVIOUS
    const loader = {
        store: storeLoader,
        order: orderLoader,
        product: productLoader,
        delivery: deliveryLoader,
        customer: customerLoader,
        collection: collectionLoader,
        transaction: transactionLoader,
        campaign: campaignLoader,
        discount: discountLoader,
        coupon: couponLoader,
        special_sales: storeSaleLoader,
        settlement: settlementLoader,
    }
    const error = {
        order: orderError,
        product: productError,
        delivery: deliveryError,
        customer: customerError,
        campaign: campaignError,
        collection: collectionError,
        transaction: transactionError,
        discount: discountError,
        coupon: couponError,
        special_sales: storeSaleError,
        settlement: settlementError,
    }
    
    // GLOBAL ERROR & GLOBAL REFETCH
    const globalConnectionError = ( orderError || productError || transactionError || collectionError || customerError || deliveryError || campaignError || discountError || couponError || storeSaleError );

    const handleGlobalRefetch = function() {
        handleFetchStore();
        handleFetchMyStoreOrders();
        handleFetchMyStoreProducts();
        handleFetchMyStoreCustomers()
        handleFetchMyStoreTransactions();
        handleFetchMyStoreCollections();
        handleFetchMyStoreDeliveryRates();
        handleFetchMyStoreDiscounts();
        /////////////////////////////////////
        // handleFetchMyStoreSettlements();
        // handleFetchMyStoreCampaigns();
        // handleFetchMyStoreCoupons();
        // handleFetchMyStoreRunningSales();
        
    }

    // HANDLE FETCHED ERROR MESSAGES
    const handleFetchError = function(errMessage) {
        let message;
        if (errMessage?.includes("Failed to fetch") || 
            errMessage == "Internet Error") {
            message = "Oops! Connection Error!!.";
        } else {
            message = errMessage;
        }
        return message;
    }


    // FETCH PROTECTED STORE AND OWNER DATA
    async function handleFetchStore() {
        setStoreLoader(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/stores/mine/store`, { method: "GET", headers });
        const data = await res.json();
        setStoreLoader(false)
        if(!data?.status || !res.ok) return
        handleStore(data?.data?.store);
    }

    // FETCH UNPROTECTED STORE ITEM BY ID
    async function handleFetchOneItem(title, id) {
        const productIdentifier = title == "product" ? "identifier/" : "";
        const url = `${import.meta.env.VITE_API_URL}/${title}s/${productIdentifier}${id}`;
        const res = await fetch(url, {
            method: "GET",
            headers
        });
        
        const data = await res.json();
        return data?.data[title != "delivery-rate" ? title : "deliveryRate"];
    }

    // FETCH UNPROTECTED STORE CATEGORIES
    async function handleFetchStoreCategories() {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/stores/category`);
        const data = await res.json();
        setStoreCategories(data.data.categories);
    }

    // DELETE ONE STORE ITEM BY ID
    async function handleDeleteOneItem(title, id) {
        await fetch(`${BASE_API_URL}/${title}/${id}`, { method: "DELETE", headers });
    }

    // FETCH PROTECTED STORE COLLECTION
    async function handleFetchMyStoreCollections() {
        setCollectionError("");
        setCollectionLoader(true);
        setCollections([]);

        try {
            const connected = await isOnline();
            if(!connected) throw new Error("Internet Error");

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
    async function handleFetchMyStoreProducts() {
        setProductError("");
        setProductLoader(true);
        setProducts([]);

        try {
            const connected = await isOnline();
            if(!connected) throw new Error("Internet Error");

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
    async function handleFetchMyStoreOrders() {
        setOrderError("");
        setOrderLoader(true);
        setOrders([]);

        try {
            const connected = await isOnline();
            if(!connected) throw new Error("Internet Error");

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
    async function handleFetchMyStoreCustomers() {
        setCustomerError("");
        setCustomerLoader(true);
        setCustomers([]);

        try {
            const connected = await isOnline();
            if(!connected) throw new Error("Internet Error");

            const res = await fetch(`${BASE_API_URL}/customers/mine/customers`, { method: "GET", headers });
            shouldKick(res);

            const data = await res.json();
            if(data.status == "fail") throw new Error();
            if (data?.data) setCustomers(data?.data?.customers);
        } catch (err) {
            console.log(err, err?.message)
            const errMessage = handleFetchError(err?.message)
            setCustomerError(errMessage);
        } finally {
            setCustomerLoader(false);
        }
    }

    // FETCH PROTECTED STIRE DELIVERY RATES
    async function handleFetchMyStoreDeliveryRates () {
        setDeliveryError("");
        setDeliveryLoader(true);
        setDeliveryRates([]);

        try {
            const connected = await isOnline();
            if(!connected) throw new Error("Internet Error");

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

    // FETCH PROTECTED STORE TRANSACTIONS
    async function handleFetchMyStoreTransactions () {
        setTransactionError("");
        setTransactionLoader(true);
        setTransactions([]);

        try {
            const connected = await isOnline();
            if(!connected) throw new Error("Internet Error");

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

    // FETCH PROTECTED STORE SETTLEMENTS
    async function handleFetchMyStoreSettlements () {
        setSettlementError("");
        setSettlementLoader(true);
        setSettlements([]);
        try {
            const connected = await isOnline();
            if(!connected) throw new Error("Internet Error");
            // code goes here...
        } catch (err) {
            const errMessage = handleFetchError(err?.message)
            setSettlementError(errMessage)
        } finally {
            setSettlementLoader(false);
        }
    }

    // FETCH PROTECTED STORE CAMPAIGNS
    async function handleFetchMyStoreCampaigns () {
        setCampaignError("");
        setCampaignLoader(true);
        setCampaigns([]);
        try {
            const connected = await isOnline();
            if(!connected) throw new Error("Internet Error");
            // code goes here...
        } catch (err) {
            const errMessage = handleFetchError(err?.message)
            setCampaignError(errMessage)
        } finally {
            setCampaignLoader(false);
        }
    }

    // FETCH PROTECTED STORE DISCOUNTS
    async function handleFetchMyStoreDiscounts () {
        setDiscountError("");
        setDiscountLoader(true);
        setDiscounts([]);
        try {
            const connected = await isOnline();
            if(!connected) throw new Error("Internet Error");
            const res = await fetch(`${BASE_API_URL}/discounts/mine/discounts`, { method: "GET", headers });
            shouldKick(res);

            const data = await res.json();
            if(data.status == "fail") throw new Error();
            if (data?.data) setDiscounts(data?.data?.discounts);
        } catch (err) {
            const errMessage = handleFetchError(err?.message)
            setDiscountError(errMessage)
        } finally {
            setDiscountLoader(false);
        }
    }

    // FETCH PROTECTED STORE COUPONS
    async function handleFetchMyStoreCoupons () {
        setCouponError("");
        setCouponLoader(true);
        setCoupons([]);
        try {
            const connected = await isOnline();
            if(!connected) throw new Error("Internet Error");
            // code goes here...
        } catch (err) {
            const errMessage = handleFetchError(err?.message)
            setCouponError(errMessage)
        } finally {
            setCouponLoader(false);
        }
    }

    // FETCH PROTECTED STORE RUNNING SALES
    async function handleFetchMyStoreRunningSales () {
        setStoreSaleError("");
        setStoreSaleLoader(true);
        setStoreSales([]);
        try {
            const connected = await isOnline();
            if(!connected) throw new Error("Internet Error");
            // code goes here...
        } catch (err) {
            const errMessage = handleFetchError(err?.message)
            setStoreSaleError(errMessage)
        } finally {
            setStoreSaleLoader(false);
        }
    }

    // UPLOAD AND UPDATE SIMGLE IMAGE
    async function handleImageUpload(Imgfile, url, tk=null) {
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
        setSettlements([]);
        setCampaigns([]);
        setDiscounts([]);
        setCoupons([]);
        setspecial_sales([]);

        if(token && user) {
            handleFetchMyStoreOrders();
            handleFetchMyStoreProducts();
            handleFetchMyStoreCustomers();
            handleFetchMyStoreCollections();
            handleFetchMyStoreDeliveryRates();
            handleFetchMyStoreTransactions();
            handleFetchMyStoreDiscounts();
            // handleFetchMyStoreSettlements();
            // handleFetchMyStoreCampaigns();
            // handleFetchMyStoreCoupons();
            // handleFetchMyStoreRunningSales();
        }
    }, [token, user])


    // CREATE CONTEXT DATA
    let contextData = {
        error,
        loader,
        orders,
        coupons,
        products,
        campaigns,
        discounts,
        customers,
        settlements,
        collections,
        transactions,
        deliveryRates,
        special_sales,
        storeCategories,
        handleFetchError,
        handleImageUpload,
        handleFetchOneItem,
        handleGlobalRefetch,
        handleDeleteOneItem,
        globalConnectionError,
        handleFetchStoreCategories,
        handleFetchMyStoreOrders,
        handleFetchMyStoreProducts,
        handleFetchMyStoreCustomers,
        handleFetchMyStoreCollections,
        handleFetchMyStoreTransactions,
        handleFetchMyStoreDeliveryRates,
        handleFetchMyStoreDiscounts,
        // handleFetchMyStoreSettlements,
        // handleFetchMyStoreCampaigns,
        // handleFetchMyStoreCoupons,
        // handleFetchMyStoreRunningSales,
    }


    return <FetchedContext.Provider value={contextData}>{children}</FetchedContext.Provider>
}


//////////////////////////////////////////////
//// CREATING HOOK AND EXPORTING ////
//////////////////////////////////////////////
export const useFetchedContext = () => useContext(FetchedContext);