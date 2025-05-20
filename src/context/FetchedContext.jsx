import { createContext, useState, useEffect, useContext } from "react";
import isOnline from "is-online";
import { useAuthContext } from "./AuthContext";
import { useCheckInternetConnection } from "../hooks/useCheckInternetConnection";
const BASE_API_URL = import.meta.env.VITE_API_URL;


//////////////////////////////////////////////
//// CREATING CONTEXT ////
//////////////////////////////////////////////
const FetchedContext = createContext();
export default FetchedContext;


//////////////////////////////////////////////
//// CREATING PROVIDER ////
//////////////////////////////////////////////
export const FetchedProvider = function({ children }) {
    const internetStatus = useCheckInternetConnection();
    const { token, user, store, shouldKick, headers, handleStore, shouldLoadAll, setShouldLoadAll, handleUser } = useAuthContext();
    const [rateExceeded, setRateExceeded] = useState(false);
    const [globalConnectionError, setGlobalConnectionError] = useState(false);

    // DOCUMENT STATES
    const [collections, setCollections] = useState([]);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [customerGroups, setCustomerGroups] = useState([]);
    const [newsletterCustomers, setNewsletterCustomers] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [deliveryRates, setDeliveryRates] = useState([]);
    const [storeCategories, setStoreCategories] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [settlements, setSettlements] = useState([]);

    
    // LOADER STATES
    const [storeLoader, setStoreLoader] = useState(false);
    const [orderLoader, setOrderLoader] = useState(true);
    const [productLoader, setProductLoader] = useState(true);
    const [deliveryLoader, setDeliveryLoader] = useState(true);
    const [customerLoader, setCustomerLoader] = useState(true);
    const [collectionLoader, setCollectionLoader] = useState(true);
    const [customerGroupLoader, setCustomerGroupLoader] = useState(true);
    const [newsletterLoader, setNewsletterLoader] = useState(true);
    const [supplierLoader, setSupplierLoader] = useState(true);
    const [transactionLoader, setTransactionLoader] = useState(true);
    const [couponLoader, setCouponLoader] = useState(true);
    const [discountLoader, setDiscountLoader] = useState(true);
    const [expensesLoader, setExpensesLoader] = useState(true);
    const [campaignLoader, setCampaignLoader] = useState(false);
    const [settlementLoader, setSettlementLoader] = useState(false);

    // ERROR STATES
    const [orderError, setOrderError] = useState("");
    const [productError, setProductError] = useState("");
    const [deliveryError, setDeliveryError] = useState("");
    const [customerError, setCustomerError] = useState("");
    const [collectionError, setCollectionError] = useState("");
    const [supplierError, setSupplierError] = useState("");
    const [customerGroupError, setCustomerGroupError] = useState("");
    const [newsletterError, setNewsletterError] = useState("");
    const [transactionError, setTransactionError] = useState("");
    const [discountError, setDiscountError] = useState("");
    const [couponError, setCouponError] = useState("");
    const [expensesError, setExpensesError] = useState("");
    const [campaignError, setCampaignError] = useState("");
    const [settlementError, setSettlementError] = useState("");

    // SETTING LOADER THIS WAY IS BETTER THAN THE PREVIOUS
    const loader = {
        store: storeLoader,
        order: orderLoader,
        product: productLoader,
        delivery: deliveryLoader,
        customer: customerLoader,
        group: customerGroupLoader,
        newsletter: newsletterLoader,
        supplier: supplierLoader,
        collection: collectionLoader,
        transaction: transactionLoader,
        campaign: campaignLoader,
        discount: discountLoader,
        coupon: couponLoader,
        expenses: expensesLoader,
        settlement: settlementLoader,
    }
    const error = {
        order: orderError,
        product: productError,
        delivery: deliveryError,
        customer: customerError,
        group: customerGroupError,
        newsletter: newsletterError,
        supplier: supplierError,
        campaign: campaignError,
        collection: collectionError,
        transaction: transactionError,
        discount: discountError,
        coupon: couponError,
        expenses: expensesError,
        settlement: settlementError,
    }
    // GLOBAL ERROR & GLOBAL REFETCH
    // const globalConnectionError = ( orderError || productError || transactionError || collectionError || customerError || customerGroupError || newsletterError || deliveryError || campaignError || discountError || couponError || expensesError || supplierError);

    const handleGlobalRefetch = async function() {
        handleFetchStore();
        handleFetchMyStoreOrders();
        handleFetchMyStoreProducts();
        handleFetchMyStoreCustomers();
        handleFetchMyStoreSuppliers();
        handleFetchMyStoreCustomerGroups();
        handleFetchStoreNewsletterCustomers();
        handleFetchMyStoreTransactions();
        handleFetchMyStoreCollections();
        handleFetchMyStoreDeliveryRates();
        handleFetchMyStoreDiscounts();
        handleFetchMyStoreCoupons();
        handleFetchMyStoreExpenses();
        /////////////////////////////////////
        // handleFetchMyStoreSettlements();
        // handleFetchMyStoreCampaigns();
        rateExceeded && setRateExceeded(false)
        globalConnectionError && setGlobalConnectionError(false)
    }

    // HANDLE FETCHED ERROR MESSAGES
    const handleFetchError = function(errMessage, setterFunction) {
        if(errMessage == "Too Many Requests" && !rateExceeded) {
            setRateExceeded(true);
            return "Whoa!, Request Limit Exeeded!.";
        }

        if (errMessage?.includes("Failed to fetch") || errMessage == "Internet Error") {
            setGlobalConnectionError(true)
            return "Oops! Connection Error!.";
        } else {
            return errMessage;
        }
    }

    // FETCH UNPROTECTED STORE ITEM BY ID
    async function handleFetchOneItem(title, id) {
        const productIdentifier = title == "product" ? "identifier/" : "";
        const url = `${BASE_API_URL}/${title}s/${productIdentifier}${id}`;

        try {
            const res = await fetch(url, { method: "GET", headers });
            const data = await res.json();
            if (res?.status === 429 || data?.status !== 'success') {
                throw new Error(data?.message || "Too Many Requests");
            }

            return data?.data[title != "delivery-rate" ? title : "deliveryRate"];
        } catch(err) {
            return { message: err?.message };
        }
    }

    // FETCH UNPROTECTED STORE CATEGORIES
    async function handleFetchStoreCategories() {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/stores/category`);
        const data = await res.json();
        setStoreCategories(data.data.categories);
    }

    // DELETE ONE STORE ITEM BY ID
    async function handleDeleteOneItem(route) {
        await fetch(`${BASE_API_URL}/${route}`, { method: "DELETE", headers });
    }

    // FETCH PROTECTED STORE AND OWNER DATA
    async function handleFetchStore() {
        setStoreLoader(true);
        try {
            const res = await fetch(`${BASE_API_URL}/stores?slug=${store?.slug}`, { method: "GET", headers });
            const data = await res.json();
            if (res?.status === 429 || data?.status == 'fail') {
                throw new Error(data?.message || "Too Many Requests");
            }
            handleStore(data?.data?.store);
            handleUser(data?.data?.auth);
        } catch(err) {
            console.log(err)
        } finally {
            setStoreLoader(false)
            setShouldLoadAll(false);
        }
    }

    // FETCH PROTECTED STORE COLLECTION
    async function handleFetchMyStoreCollections() {
        setCollectionError("");
        setCollectionLoader(true);

        try {
            const connected = await isOnline();
            if(!connected) throw new Error("Internet Error");
            const res = await fetch(`${BASE_API_URL}/collections?slug=${store?.slug}`, { method: "GET", headers })
            shouldKick(res);

            const data = await res.json();
            if(res.status === 429) throw new Error("Too Many Requests")
            if(data.status == "fail") throw new Error();
            setCollections(data?.data?.collections);
        } catch(err) {
            const errMessage = handleFetchError(err?.message);
            setCollections([]);
            setCollectionError(errMessage);
        } finally {
            setCollectionLoader(false);
        }
    }

    // FETCH PROTECTED STORE PRODUCTS
    async function handleFetchMyStoreProducts() {
        setProductError("");
        setProductLoader(true);

        try {
            const connected = await isOnline();
            if(!connected) throw new Error("Internet Error");
            const res = await fetch(`${BASE_API_URL}/products?slug=${store?.slug}`, { method: "GET", headers });
            shouldKick(res);

            const data = await res.json();
            if(res.status === 429) throw new Error("Too Many Requests")
            if(data.status == "fail") throw new Error();
            setProducts(data?.data?.products);
        } catch (err) {
            const errMessage = handleFetchError(err?.message);
            setProducts([]);
            setProductError(errMessage);
        } finally {
            setProductLoader(false);
        }
    }

    // FETCH PROTECTED STORE SALES AND ORDERS
    async function handleFetchMyStoreOrders() {
        setOrderError("");
        setOrderLoader(true);

        try {
            const connected = await isOnline();
            if(!connected) throw new Error("Internet Error");
            const res = await fetch(`${BASE_API_URL}/orders?slug=${store?.slug}`, { method: "GET", headers });
            shouldKick(res);

            const data = await res.json();
            if(res.status === 429) throw new Error("Too Many Requests")
            if(data.status == "fail") throw new Error();
            setOrders(data?.data?.orders);
        } catch (err) {
            const errMessage = handleFetchError(err?.message)
            setOrders([]);
            setOrderError(errMessage);
        } finally {
            setOrderLoader(false);
        }
    }

    // FETCH PROTECTED STORE CUSTOMERS
    async function handleFetchMyStoreCustomers() {
        setCustomerError("");
        setCustomerLoader(true);

        try {
            const connected = await isOnline();
            if(!connected) throw new Error("Internet Error");
            const res = await fetch(`${BASE_API_URL}/customers?slug=${store?.slug}`, { method: "GET", headers });
            shouldKick(res);

            const data = await res.json();
            if(res.status === 429) throw new Error("Too Many Requests")
            if(data.status == "fail") throw new Error();
            setCustomers(data?.data?.customers);
        } catch (err) {
            const errMessage = handleFetchError(err?.message)
            setCustomers([]);
            setCustomerError(errMessage);
        } finally {
            setCustomerLoader(false);
        }
    }

    // FETCH PROTECTED STORE CUSTOMERS GROUPS
    async function handleFetchMyStoreCustomerGroups() {
        setCustomerGroupError("");
        setCustomerGroupLoader(true);
        setCustomerGroups([]);

        try {
            const connected = await isOnline();
            if(!connected) throw new Error("Internet Error");
            const res = await fetch(`${BASE_API_URL}/groups?slug=${store?.slug}`,
                { method: "GET", headers }
            );
            shouldKick(res);

            const data = await res.json();
            if(res.status === 429) throw new Error("Too Many Requests")
            if(data.status == "fail") throw new Error();
            setCustomerGroups(data?.data?.groups);
        } catch (err) {
            console.log(err, err?.message)
            const errMessage = handleFetchError(err?.message)
            setCustomerGroupError(errMessage);
        } finally {
            setCustomerGroupLoader(false);
        }
    }

    // FETCH PROTECTED STORE NEWSLETTER CUSTOMERS
    async function handleFetchStoreNewsletterCustomers () {
        setNewsletterError("");
        setNewsletterLoader(true);
        setNewsletterCustomers([]);

        try {
            const connected = await isOnline();
            if(!connected) throw new Error("Internet Error");
            const res = await fetch(`${BASE_API_URL}/customers/newsletters?slug=${store?.slug}`,
                { method: "GET", headers }
            );
            shouldKick(res);

            const data = await res.json();
            if(res.status === 429) throw new Error("Too Many Requests")
            if(data.status == "fail") throw new Error();
            setNewsletterCustomers(data?.data?.customers);
        } catch (err) {
            console.log(err, err?.message)
            const errMessage = handleFetchError(err?.message)
            setNewsletterError(errMessage)
        } finally {
            setNewsletterLoader(false);
        }
    }

    // FETCH PROTECTED STORE SUPPLIERS
    async function handleFetchMyStoreSuppliers() {
        setSupplierError("");
        setSupplierLoader(true);

        try {
            const connected = await isOnline();
            if(!connected) throw new Error("Internet Error");
            const res = await fetch(`${BASE_API_URL}/suppliers?slug=${store?.slug}`, { method: "GET", headers });
            shouldKick(res);

            const data = await res.json();
            if(res.status === 429) throw new Error("Too Many Requests")
            if(data.status == "fail") throw new Error();
            setSuppliers(data?.data?.suppliers);
        } catch (err) {
            const errMessage = handleFetchError(err?.message);
            setSuppliers([]);
            setSupplierError(errMessage);
        } finally {
            setSupplierLoader(false);
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
            const res = await fetch(`${BASE_API_URL}/delivery-rates?slug=${store?.slug}`, { method: "GET", headers });
            shouldKick(res);

            const data = await res.json();
            if(res.status === 429) throw new Error("Too Many Requests")
            if(data.status == "fail") throw new Error();
            setDeliveryRates(data?.data?.rates);
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

        try {
            const connected = await isOnline();
            if(!connected) throw new Error("Internet Error");
            const res = await fetch(`${BASE_API_URL}/transactions?slug=${store?.slug}`, { method: "GET", headers });
            shouldKick(res);

            const data = await res.json();
            if(res.status === 429) throw new Error("Too Many Requests")
            if(data.status == "fail") throw new Error();
            setTransactions(data?.data?.transactions);

        } catch (err) {
            const errMessage = handleFetchError(err?.message);
            setTransactions([]);
            setTransactionError(errMessage);
        } finally {
            setTransactionLoader(false);
        }
    }

    // FETCH PROTECTED STORE SETTLEMENTS
    // async function handleFetchMyStoreSettlements () {
    //     setSettlementError("");
    //     setSettlementLoader(true);
    //     setSettlements([]);
    //     try {
    //         const connected = await isOnline();
            // if(!connected) throw new Error("Internet Error");
    //     } catch (err) {
    //         const errMessage = handleFetchError(err?.message)
    //         setSettlementError(errMessage)
    //     } finally {
    //         setSettlementLoader(false);
    //     }
    // }

    // FETCH PROTECTED STORE CAMPAIGNS
    // async function handleFetchMyStoreCampaigns () {
    //     setCampaignError("");
    //     setCampaignLoader(true);
    //     setCampaigns([]);
    //     try {
    //         const connected = await isOnline();
            // if(!connected) throw new Error("Internet Error");
    //     } catch (err) {
    //         const errMessage = handleFetchError(err?.message)
    //         setCampaignError(errMessage)
    //     } finally {
    //         setCampaignLoader(false);
    //     }
    // }

    // FETCH PROTECTED STORE DISCOUNTS
    async function handleFetchMyStoreDiscounts () {
        setDiscountError("");
        setDiscountLoader(true);

        try {
            const connected = await isOnline();
            if(!connected) throw new Error("Internet Error");
            const res = await fetch(`${BASE_API_URL}/discounts?slug=${store?.slug}`, { method: "GET", headers });
            shouldKick(res);

            const data = await res.json();
            if(res.status === 429) throw new Error("Too Many Requests")
            if(data.status == "fail") throw new Error();
            setDiscounts(data?.data?.discounts);
        } catch (err) {
            const errMessage = handleFetchError(err?.message);
            setDiscounts([]);
            setDiscountError(errMessage);
        } finally {
            setDiscountLoader(false);
        }
    }

    // FETCH PROTECTED STORE COUPONS
    async function handleFetchMyStoreCoupons () {
        setCouponError("");
        setCouponLoader(true);

        try {
            const connected = await isOnline();
            if(!connected) throw new Error("Internet Error");
            const res = await fetch(`${BASE_API_URL}/coupons?slug=${store?.slug}`, { method: "GET", headers });
            shouldKick(res);

            const data = await res.json();
            if(res.status === 429) throw new Error("Too Many Requests")
            if(data.status == "fail") throw new Error();
            setCoupons(data?.data?.coupons);
        } catch (err) {
            const errMessage = handleFetchError(err?.message);
            setCoupons([]);
            setCouponError(errMessage);
        } finally {
            setCouponLoader(false);
        }
    }

    // FETCH PROTECTED STORE EXPENSES
    async function handleFetchMyStoreExpenses () {
        setExpensesError("");
        setExpensesLoader(true);

        try {
            const connected = await isOnline();
            if(!connected) throw new Error("Internet Error");
            const res = await fetch(`${BASE_API_URL}/expenses?slug=${store?.slug}`, { method: "GET", headers });
            shouldKick(res);

            const data = await res.json();
            if(res.status === 429) throw new Error("Too Many Requests")
            if(data.status == "fail") throw new Error();
            setExpenses(data?.data?.expenses);
        } catch (err) {
            const errMessage = handleFetchError(err?.message);
            setExpenses([]);
            setExpensesError(errMessage);
        } finally {
            setExpensesLoader(false);
        }
    }

    useEffect(function () {
        setCollections([]);
        setProducts([]);
        setOrders([]);
        setCustomers([]);
        setCustomerGroups([]);
        setNewsletterCustomers([]);
        setSuppliers([]);
        setDeliveryRates([]);
        setTransactions([]);
        setSettlements([]);
        setCampaigns([]);
        setDiscounts([]);
        setCoupons([]);

        if(token && user && shouldLoadAll) {
            handleFetchMyStoreOrders();
            handleFetchMyStoreProducts();
            handleFetchMyStoreCustomers();
            handleFetchMyStoreCollections();
            handleFetchMyStoreCustomerGroups();
            handleFetchStoreNewsletterCustomers();
            handleFetchMyStoreSuppliers();
            handleFetchMyStoreDeliveryRates();
            handleFetchMyStoreTransactions();
            handleFetchMyStoreDiscounts();
            handleFetchMyStoreCoupons();
            handleFetchMyStoreExpenses();
            // handleFetchMyStoreSettlements();
            // handleFetchMyStoreCampaigns();
            setRateExceeded(false);
            setGlobalConnectionError(false);
        }
    }, [token, user, shouldLoadAll])


    // CREATE CONTEXT DATA
    let contextData = {
        error,
        loader,
        rateExceeded,
        setRateExceeded,
        handleFetchError,
        handleGlobalRefetch,
        globalConnectionError,

        orders,
        coupons,
        expenses,
        suppliers,
        products,
        campaigns,
        discounts,
        customers,
        settlements,
        collections,
        transactions,
        deliveryRates,
        customerGroups,
        storeCategories,
        newsletterCustomers,
        
        handleFetchOneItem,
        handleDeleteOneItem,
        handleFetchStoreCategories,
        handleFetchMyStoreOrders,
        handleFetchMyStoreProducts,
        handleFetchMyStoreCustomers,
        handleFetchMyStoreCustomerGroups,
        handleFetchStoreNewsletterCustomers,
        handleFetchMyStoreSuppliers,
        handleFetchMyStoreCollections,
        handleFetchMyStoreTransactions,
        handleFetchMyStoreDeliveryRates,
        handleFetchMyStoreDiscounts,
        handleFetchMyStoreCoupons,
        handleFetchMyStoreExpenses,
        // handleFetchMyStoreSettlements,
        // handleFetchMyStoreCampaigns,
    }


    return <FetchedContext.Provider value={contextData}>{children}</FetchedContext.Provider>
}


//////////////////////////////////////////////
//// CREATING HOOK AND EXPORTING ////
//////////////////////////////////////////////
export const useFetchedContext = () => useContext(FetchedContext);