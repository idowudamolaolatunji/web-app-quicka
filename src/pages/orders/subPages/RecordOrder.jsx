import React, { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use';

import Asterisk from '../../../components/elements/Asterisk.jsx';
import QuillEditor from '../../../components/form/QuillEditor.jsx';

import { MdOutlineShoppingBag } from 'react-icons/md';
import { useAuthContext } from '../../../context/AuthContext.jsx';
import Line from '../../../components/elements/Line.jsx';
import { AiOutlinePlus } from 'react-icons/ai';
import Info from '../../../components/elements/Info.jsx';
import MainDropdownSelect from '../../../components/form/MainDropdownSelect.jsx';

import { useFetchedContext } from '../../../context/FetchedContext.jsx';
import Drawer from '../../../components/modal/Drawer.jsx';

import { validateOrderForm } from '../../../utils/validationHelper.js';
import { useNavigate } from 'react-router-dom';
import AddCustomerFormSm from '../../../components/pageComponents/AddCustomerFormSm.jsx';
import { createPortal } from 'react-dom';
import UploadProduct from '../../products/subPages/UploadProduct.jsx';
import FullScreen from '../../../components/modal/FullScreen.jsx';
import ProductQuantityCard from '../../../components/layout/ProductQuantityCard.jsx';
import AddPageUI from '../../../ui/PageUI/AddPageUI.jsx';
import isOnline from 'is-online';
import CurrencyInputField from '../../../components/form/CurrencyInputField.jsx';
import { formatNumber } from '../../../utils/helper.js';
import { paymentMethodData, deliveryStatusData } from '../../../utils/data.jsx'
import { channelData } from '../../../utils/data.js'
import moment from 'moment';
import { HiOutlineShoppingCart } from 'react-icons/hi';


const BASE_API_URL = import.meta.env.VITE_API_URL

export default function RecordOrder() {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { headers, shouldKick, currency } = useAuthContext();
    const { error, products, customers, handleFetchError, handleFetchMyStoreOrders, handleFetchMyStoreProducts, handleFetchMyStoreCustomers, handleFetchMyStoreTransactions } = useFetchedContext();
    // const today = moment().format();
    const today = moment.utc().format("YYYY-MM-DDTHH:mm:ss.SSSZ");

    /////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////
    const [orderData, setOrderData] = useState({ paymentStatus: "paid", orderDate: today || "", deliveryFee: null });
    const [description, setDescription] = useState("");

    ////////// Dropdown array /////////////////////////////
    const [orderProducts, setOrderProducts] = useState([]);
    const [orderCustomer, setOrderCustomer] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState([]);
    const [deliveryStatus, setDeliveryStatus] = useState([]);
    const [channel, setChannel] = useState([]);
    ////////////////////////////////////////////////////////
    
    const [showModal, setShowModal] = useState({ product: false, customer: false });
    const [salesFormErrors, setSalesFormErrors] = useState({});
    const [loading, setLoading] = useState({ mainLoading: false, imageLoading: false });
    const [response, setResponse] = useState({ status: null, message: null });
    const [showConfetti, setShowConfetti] = useState(false)

    const [selectedProducts, setSelectedProducts] = useState([]);
    const [subTotal, setSubTotal] = useState({ total: 0, profit: 0 });
    ////////////////////////////////////////////////////////////////////////////////


    // HANDLE CHANGE QUANTITY FOR PARTICULAR SELECTED PRODUCT
    const handleQuantityChange = function(productId, newQuantity) {
        setSelectedProducts((prev) => 
            prev.map((item) => (
                item.id === productId ? { ...item, quantity: newQuantity } : item)
            )
        );
    }

    // REMOVE A PRODUCT FROM THE ORDER PRODUCTS ARRAY
    const handleRemoveItem = function(id) {
        setOrderProducts(prev => prev?.filter(product => product._id !== id))
    }

    // HANDLE ORDER DATA
    const handleOrderDataChange = function(e) {
        const { name, value } = e?.target;
        setOrderData({
            ...orderData,
            [name]: value,
        });
    }

    const handleToggleModal = function(name) {
        setShowModal({ ...showModal, [name]: !showModal[name] })
    }

    const handleClearFields = function() {
        setOrderData({
            paymentStatus: "paid",
            orderDate: today || "",
            deliveryFee: null
        });

        setDescription("");
        setPaymentMethod([]);
        setDeliveryStatus([]);
        setOrderCustomer([]);
        setOrderProducts([]);
        setChannel([]);

        window?.scrollTo({ top: 0, behavior: "smooth" });
        setSalesFormErrors({})
    };

    useEffect(function() {
        document.title = "Quicka | Record orders";

        if((customers?.length < 1 && error?.customer) || (products?.length < 1 && error?.product)) {
            handleFetchMyStoreCustomers();
            handleFetchMyStoreProducts();
        }
    }, []);

    useEffect(function () {
        if (orderData.paymentStatus == "unpaid") {
            setPaymentMethod([]);
        }
    }, [orderData.paymentStatus]);

    // THIS EFFECT HERE IS VERY IMPORTANT FOR THE SELECTED PRODUCT INITIAL VALUE
    useEffect(function() {
        const initValue = orderProducts.map((product) => ({
            id: product?._id,
            name: product?.name,
            price: product?.price,
            quantity: 1,
            discount: 0,
            productId: product?.productId,
            image: product?.images[0]?.url,
            product_collection: product?.product_collection?.map(collection => collection?.name),
        }));
        setSelectedProducts(initValue);
    }, [orderProducts]);


    // GET THE ORDER SUBTOTAL, ALL PRODUCTS MINUS THEIR INDIVIDUAL DISCOUNT PLUS ORDER DELIVERY FEE
    useEffect(() => {
        const productSumTotal = selectedProducts.reduce((acc, product) => {
        return acc + ((product?.price * product?.quantity) - (product?.discount || 0));
        }, 0);
        
        const total = productSumTotal + Number(orderData.deliveryFee || 0);
        setSubTotal({ total, profit: productSumTotal });
    }, [selectedProducts, orderData.deliveryFee]);


    // CLEAR DELIVERY FEE IF NO PRODUCT SELECTED
    useEffect(function() {
        if(orderProducts.length < 1) {
            setOrderData({ ...orderData, deliveryFee: null })
        }
    }, [orderProducts, selectedProducts, orderData.deliveryFee]);


    async function handleRecordOrder() {
        // FORM VALIDATIONS 
        let formData = {
            channel,
            ...orderData,
            orderProducts,
            paymentMethod,
            deliveryStatus,
            selectedProducts,
        }

        const quantities = selectedProducts.reduce((acc, product) => acc + product?.quantity, 0);

        const newErrors = validateOrderForm(formData);
        setSalesFormErrors(newErrors);
        if (Object.keys(newErrors).length >= 1) {
            setResponse({ status: "error", message: "Fill required fields to proceed!" });
            setTimeout(() => setResponse({ status: "", message: "" }), 5000);
            return;
        };

        // SET LOADER
        setResponse({ status: "", message: "" });
        setLoading({ ...loading, mainLoading: true });

        try {
            // CHECK CONNECTION
            const connected = await isOnline();
            if(!connected) throw new Error("Internet Error");
            
            // MAKE REQUEST
            const res = await fetch(`${BASE_API_URL}/orders/record`, {
                headers,
                method: "POST",
                body: JSON.stringify({
                    description,
                    ...orderData,
                    profit: subTotal.profit,
                    orderSubTotal: subTotal.total,
                    channel: channel[0]?.value,
                    products: selectedProducts,
                    orderTotalQuantity: quantities,
                    customer: orderCustomer[0]?._id,
                    paymentMethod: paymentMethod[0]?.value,
                    orderDeliveryFee: orderData.deliveryFee,
                    deliveryStatus: deliveryStatus[0]?.value,
                })
            });
            shouldKick(res);

            const data = await res.json();
            const { status, message } = data;
            if (status !== 'success') throw new Error(message);

            // CLEAR FIELDS AND SET RESPONSE MESSAGE
            handleClearFields();
            setResponse({ status: "success", message });
            setShowConfetti(true)

            setTimeout(() => navigate(-1), 1000);
            handleFetchMyStoreOrders();
            handleFetchMyStoreProducts();
            handleFetchMyStoreTransactions();

        } catch (err) {
            const message = handleFetchError(err?.message)
            setResponse({ status: "error", message });
        } finally {
            setLoading({ ...loading, mainLoading: false })
        }
    }


    return (
        <React.Fragment>
            {showModal.product && (
                <FullScreen style={{ maxWidth: '108rem', margin: '0 auto' }}>
                    <UploadProduct ismodal close={() => handleToggleModal("product")} />
                </FullScreen>
            )}

            {showModal.customer && (
                createPortal(
                    <Drawer
                        title="Add Customer"
                        setClose={() => handleToggleModal("customer")}
                    >
                        <AddCustomerFormSm close={() => handleToggleModal("customer")} />
                    </Drawer>,
                    document.body
                )
            )}

            <AddPageUI
                pageTitle="Record Orders"
                pageIcon={<HiOutlineShoppingCart />}
                close={() => navigate(-1)}
                mainLoader={loading.mainLoading}
                response={response}
                handleClear={handleClearFields}
                handleSubmit={handleRecordOrder}
                confetti={showConfetti}
                hasExplainer={true}
                btnBelow={true}
            >

                <div className="product__upload--container">
                    {width < 400 && <Line border={1.4} />}

                    <div className='left--container containers'>
                        <div className="card form">
                            <div className="section--heading">
                                <h2>Order Item</h2>
                                {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                            </div>


                            <div className="form--item">
                                <label className="form--label">Product(s) <Asterisk /></label>

                                <MainDropdownSelect title="Product" options={products} field="name" value={orderProducts} setValue={setOrderProducts} noDataLabel="No product found!" multiple={true} />
                                <span className="form--error-message">
                                    {salesFormErrors.orderProducts && salesFormErrors.orderProducts}
                                </span>

                                {orderProducts?.length > 0 && (
                                    <div className='product--quantity-grid'>
                                        {orderProducts?.map((product) => (
                                            <ProductQuantityCard
                                                key={product?._id}
                                                product={product}
                                                quantity={selectedProducts?.find(item => item.id == product?._id)?.quantity}
                                                removeItem={handleRemoveItem}
                                                onQuantityChange={(newQuantity) => handleQuantityChange(product?._id, newQuantity)}
                                                discount={selectedProducts?.find(item => item.id == product?._id)?.discount}
                                                setDiscount={(value) => setSelectedProducts((prev) =>
                                                    prev.map((item) => (
                                                        item.id === product?._id ? 
                                                            { ...item, discount: Number((value >= product.price) ? product.price : value || 0) }
                                                        : item)
                                                    )
                                                )}
                                            />
                                        ))}
                                    </div>
                                )}

                                <button className='form--add' onClick={() => setShowModal({ ...showModal, product: true })}>
                                    <AiOutlinePlus />
                                    <p>Add New Product</p>
                                </button>
                                <Info text="Add new product, If you're yet to upload the order product" />
                            </div>

                            <div className="form--item">
                                <label className='form--label'>Delivery Fee ({currency})</label>
                                <CurrencyInputField name="deliveryFee" value={orderData.deliveryFee} setValue={setOrderData} />

                                <div style={{ display: "flex", justifyContent: "space-between",  alignItems: "center", width: "100%" }}>

                                    <label className='form--label'>Order SubTotal:</label>
                                    <span style={{ fontSize: "1.4rem" }}>
                                        {currency}
                                        <span className='value'>
                                            {formatNumber(subTotal.total)}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>


                        {width < 400 && <Line border={1.4} />}


                        <div className="card form">
                            <div className="section--heading">
                                <h2>Order Details</h2>
                                {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                            </div>

                            <div className="form--grid">
                                <div className="form--item">
                                    <label className="form--label">Order / Sales Channel <Asterisk /></label>

                                    <MainDropdownSelect title="a Channel" options={channelData} field="label" value={channel} setValue={setChannel} />
                                    <span className="form--error-message">
                                        {salesFormErrors.channel && salesFormErrors.channel}
                                    </span>
                                </div>

                                <div className="form--item">
                                    <label id='date' className="form--label">Order Date <Asterisk /></label>
                                    <input type="datetime-local" className='form--input' placeholder='Select date' max={new Date().toISOString().slice(0, 16)} name="orderDate" id="date" value={orderData.orderDate} onChange={handleOrderDataChange} />
                                    <span className="form--error-message">
                                        {salesFormErrors.orderDate && salesFormErrors.orderDate}
                                    </span>
                                </div>
                            </div>

                            <div className="form--item">
                                <label className="form--label">Customer (optional)</label>
                                <MainDropdownSelect title="Customer" options={customers} field="fullname" value={orderCustomer} setValue={setOrderCustomer} noDataLabel='No customer found!' />
                                <Info text="If you don't have customer's details, Leave blank" />

                                <button className='form--add' onClick={() => setShowModal({ ...showModal, customer: true })}>
                                    <AiOutlinePlus />
                                    <p>Add Customer</p>
                                </button>
                            </div>
                        </div>
                    </div>

                    {width < 400 && <Line border={1.4} />}

                    <div className='right--container containers'>
                        <div className="card form">
                            <div className="section--heading">
                                <h2>Order Payment & Delivery</h2>
                                {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                            </div>

                            <div className="form--item">
                                <label className="form--label">Payment Status</label>

                                <div className="form--clicks">
                                    <div className={`form--click ${orderData.paymentStatus == "paid" ? 'is-selected' : ''}`}
                                        onClick={() => setOrderData({ ...orderData, paymentStatus: "paid" })}
                                    >Paid <span></span>
                                    </div>
                                    <div className={`form--click ${orderData.paymentStatus == "partially" ? 'is-selected' : ''}`}
                                        onClick={() => setOrderData({ ...orderData, paymentStatus: "partially" })}
                                    >Partly Paid<span></span>
                                    </div>
                                    <div className={`form--click ${orderData.paymentStatus == "unpaid" ? 'is-selected' : ''}`}
                                        onClick={() => setOrderData({ ...orderData, paymentStatus: "unpaid" })}
                                    >Unpaid<span></span>
                                    </div>
                                </div>
                            </div>


                            {orderData.paymentStatus != "unpaid" && (
                                <div className="form--item">
                                    <label className="form--label">Payment Method <Asterisk /></label>

                                    <MainDropdownSelect title="a Payment Method" options={paymentMethodData} field="label" value={paymentMethod} setValue={setPaymentMethod} searchable={false} />

                                    <span className="form--error-message">
                                        {salesFormErrors.paymentMethod && salesFormErrors.paymentMethod}
                                    </span>
                                </div>
                            )}

                            <div className="form--item">
                                <label htmlFor='status' className='form--label'>Delivery Status <Asterisk /></label>

                                <MainDropdownSelect title="a Delivery Status" options={deliveryStatusData} field="label" value={deliveryStatus} setValue={setDeliveryStatus} searchable={false} />
                                <span className="form--error-message">
                                    {salesFormErrors.deliveryStatus && salesFormErrors.deliveryStatus}
                                </span>
                            </div>


                            <div className="form--item">
                                <label htmlFor="" className="form--label">Addition Note (optional)</label>
                                <QuillEditor value={description} setValue={setDescription} />
                            </div>
                        </div>
                    </div>
                </div>
            </AddPageUI>
        </React.Fragment>
    )
}