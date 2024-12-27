import React, { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use';

import Asterisk from '../../components/elements/Asterisk.jsx';
import QuillEditor from '../../components/form/QuillEditor.jsx';

import { MdOutlineShoppingBag } from 'react-icons/md';
import { useAuthContext } from '../../context/AuthContext.jsx';
import Line from '../../components/elements/Line.jsx';
import { AiOutlinePlus } from 'react-icons/ai';
import Info from '../../components/elements/Info.jsx';
import MainDropdownSelect from '../../components/form/MainDropdownSelect.jsx';

import { paymentMethodData, deliveryStatusData, channelData } from '../../utils/data.jsx'
import { useFetchedContext } from '../../context/FetchedContext.jsx';
import Drawer from '../../components/modal/Drawer.jsx';

import { validateOrderForm } from '../../utils/validationHelper.js';
import { useNavigate } from 'react-router-dom';
import AddCustomerFormSm from '../../components/pageComponents/AddCustomerFormSm.jsx';
import { createPortal } from 'react-dom';
import UploadProduct from '../uploadProduct/index.jsx';
import FullScreen from '../../components/modal/FullScreen.jsx';
import ProductQuantityCard from '../../components/layout/ProductQuantityCard.jsx';
import AddPageUI from '../../ui/PageUI/AddPageUI.jsx';
import isOnline from 'is-online';


const BASE_API_URL = import.meta.env.VITE_API_URL

function index() {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { headers, shouldKick } = useAuthContext();
    const { products, customers, handleFetchError, handleFetchUserStoreOrders, handleFetchUserStoreProducts, handleFetchUserStoreCustomers, handleFetchUserStoreTransactions } = useFetchedContext();
    const publishedProducts = products?.filter(product => product.status == "published");

    /////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////
    const [orderData, setOrderData] = useState({ paymentStatus: "paid", orderDate: "" });

    const [loading, setLoading] = useState({ mainLoading: false, imageLoading: false });
    const [response, setResponse] = useState({ status: null, message: null });

    const [description, setDescription] = useState('');
    const [orderProducts, setOrderProducts] = useState([]);
    const [orderCustomer, setOrderCustomer] = useState([]);

    const [paymentMethod, setPaymentMethod] = useState([]);
    const [deliveryStatus, setDeliveryStatus] = useState([]);
    const [channel, setChannel] = useState([]);
    const [showConfetti, setShowConfetti] = useState(false)
    
    const [salesFormErrors, setSalesFormErrors] = useState({})
    const [showModal, setShowModal] = useState({ product: false, customer: false });

    const [productQuantities, setProductQuantities] = useState([]);
    ////////////////////////////////////////////////////////////////////////////////

    const handleQuantityChange = function(productId, newQuantity) {
        setProductQuantities((prev) => prev.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)));
    }

    const handleRemoveItem = function(id) {
        setOrderProducts(prev => prev?.filter(product => product._id !== id))
    }

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
            orderDate: ""
        });

        setDescription("");
        setPaymentMethod([]);
        setDeliveryStatus([]);
        setOrderCustomer([]);
        setOrderProducts([]);
        setChannel([]);

        window.scrollTo(0, 0)
    };

    useEffect(function() {
        document.title = "Quicka | Record sales";

        handleFetchUserStoreCustomers();
        handleFetchUserStoreProducts();
    }, [])

    useEffect(function () {
        if (orderData.paymentStatus == "unpaid") {
            setPaymentMethod([]);
        }
    }, [orderData.paymentStatus]);

    // THIS EFFECT HERE IS VERY IMPORTANT FOR THE PRODUCT QUANTITY INITIAL VALUE
    useEffect(function() {
        const initQuantities = orderProducts.map((product) => ({
            id: product._id,
            quantity: 1,
        }));
        setProductQuantities(initQuantities);
    }, [orderProducts])


    async function handleRecordOrder() {
        // FORM VALIDATIONS 
        let formData = {
            channel,
            ...orderData,
            orderProducts,
            paymentMethod,
            deliveryStatus,
            productQuantities,
        }

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

        // PRODUCTQUANTITIES, CONTAINS THE ID AND THE QUANTITY OF THAT ID. (AND THAT IS JUST WHAT THE BACKEND NEEDS)
        const products = productQuantities;

        try {
            // CHECK CONNECTION
            const connected = await isOnline();
            if(!connected) throw new Error("Internet Error");
            
            // MAKE REQUEST
            const res = await fetch(`${BASE_API_URL}/orders/record`, {
                headers,
                method: "POST",
                body: JSON.stringify({
                    products,
                    description,
                    ...orderData,
                    channel: channel[0]?.value,
                    paymentMethod: paymentMethod[0]?.value,
                    customer: orderCustomer[0]?._id,
                    deliveryStatus: deliveryStatus[0]?.value,
                })
            });
            shouldKick(res);

            const data = await res.json();
            const { status, message } = data;
            if (status !== 'success') throw new Error(message);

            // SET RESPONSE MESSAGE
            setResponse({ status: "success", message });
            setShowConfetti(true)

            window.scrollTo(0, 0);
            handleClearFields();

            setTimeout(() => navigate(-1), 3000);
            handleFetchUserStoreOrders();
            handleFetchUserStoreProducts();
            handleFetchUserStoreTransactions();

        } catch (err) {
            const message = handleFetchError(err?.message)
            setResponse({ status: "error", message });
        } finally {
            setLoading({ ...loading, mainLoading: false })
        }
    }


    return (
        <>
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
                pageIcon={<MdOutlineShoppingBag />}
                close={() => navigate(-1)}
                mainLoader={loading.mainLoading}
                response={response}
                handleClear={handleClearFields}
                handleSubmit={handleRecordOrder}
                confetti={showConfetti}
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

                                <MainDropdownSelect title="Product" options={publishedProducts} field="name" value={orderProducts} setValue={setOrderProducts} noDataLabel="No product found!" multiple={true} />
                                <span className="form--error-message">
                                    {salesFormErrors.orderProducts && salesFormErrors.orderProducts}
                                </span>

                                {orderProducts?.length > 0 && (
                                    <div className='product--quantity-grid'>
                                        {orderProducts?.map((product) => (
                                            <ProductQuantityCard
                                                key={product._id}
                                                product={product}
                                                quantity={productQuantities?.find(item => item.id == product._id)?.quantity}
                                                onQuantityChange={(newQuantity) => handleQuantityChange(product._id, newQuantity)}
                                                removeItem={handleRemoveItem}
                                            />
                                        ))}
                                    </div>
                                )}

                                <button className='form--add' onClick={() => setShowModal({ ...showModal, product: true })}>
                                    <AiOutlinePlus />
                                    <p>Add New Product</p>
                                </button>
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
        </>
    )
}

export default index