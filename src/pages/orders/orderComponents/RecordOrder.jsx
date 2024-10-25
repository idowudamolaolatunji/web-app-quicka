import React, { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use';

import Asterisk from '../../../components/Asterisk';
import QuillEditor from '../../../components/QuillEditor';
import BackButton from '../../../components/button/BackButton';
import SimpleModal from '../../../components/modal/Simple';

import { MdOutlineShoppingBag } from 'react-icons/md';
import { useAuthContext } from '../../../context/AuthContext';
import Line from '../../../components/Line';
import '../../uploadStyle.css';
import { AiOutlinePlus } from 'react-icons/ai';
import Info from '../../../components/Info';
import MainDropdownSelect from '../../../components/MainDropdownSelect';

import { paymentMethodData, deliveryStatusData, channelData } from '../../../utils/data.jsx'
import { useFetchedContext } from '../../../context/FetchedContext';
import UploadProduct from '../../products/productComponents/UploadProduct';
import FullScreen from '../../../components/modal/FullScreen';
import Drawer from '../../../components/modal/Drawer';
import AddCustomer from './AddCustomer';

import Spinner from '../../../components/spinner/spinner_two';
import CustomAlert from '../../../components/CustomAlert';
import ConfettiUI from '../../../components/ConfettiUI';

import { truncateString } from '../../../utils/helper.js';
import { validateOrderForm } from '../../../utils/validationHelper.js';
import { DatePicker, Stack } from 'rsuite';
import { useNavigate } from 'react-router-dom';


const BASE_API_URL = import.meta.env.VITE_API_URL

function RecordOrder() {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { token } = useAuthContext();
    const { products, customers, handleFetchUserStoreOrders } = useFetchedContext();

    const publishedProducts = products?.filter(product => product.status == "published");

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    }

    const [orderData, setOrderData] = useState({
        paymentStatus: "paid",
        orderDate: ""
    });

    const [loading, setLoading] = useState({
        mainLoading: false,
        imageLoading: false
    });

    const [response, setResponse] = useState({
        status: null,
        message: null
    });

    const [description, setDescription] = useState('');
    const [orderProducts, setOrderProducts] = useState([]);
    const [orderCustomer, setOrderCustomer] = useState([]);

    const [paymentMethod, setPaymentMethod] = useState([]);
    const [deliveryStatus, setDeliveryStatus] = useState([]);
    const [channel, setChannel] = useState([]);

    const [showModal, setShowModal] = useState({
        product: false,
        customer: false
    });

    const [showConfetti, setShowConfetti] = useState(false)
    const [salesFormErrors, setSalesFormErrors] = useState({})

    // ((stockAmount)) down here

    // const transformedProducts = products?.map(product => ({
    //     label: (
    //         <span className='flex align' key={product?._id}>
    //             <img src={BASE_URL + product?.images[0]} />
    //             <span className='p-input--item'>
    //                 <p>{width < 450 ? truncateString(product?.name, 30) : product?.name }</p>
    //                 <span>{product?.productCollection}</span>
    //             </span>
    //         </span>
    //     ),
    //     value: product._id
    // }));
    
    function handleOrderDataChange(e) {
        const { name, value } = e?.target;
        console.log(name, value)
        setOrderData({
            ...orderData,
            [name]: value,
        });
    }

    function handleCloseModal(name) {
        setShowModal({ ...showModal, [name]: false });
    }

    function handleClearFields() {
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
    }

    useEffect(function () {
        window.scrollTo(0, 0);
    }, []);

    useEffect(function () {
        if (orderData.paymentStatus == "unpaid") {
            setPaymentMethod([]);
        }
    }, [orderData.paymentStatus]);


    async function handleRecordOrder() {
        // FORM VALIDATIONS 
        let formData = { 
            channel,
            ...orderData,
            orderProducts,
            paymentMethod,
            deliveryStatus,
        }

        const newErrors = validateOrderForm(formData);
        setSalesFormErrors(newErrors);
        if (Object.keys(newErrors).length >= 1) {
            setResponse({ status: "error", message: "Fill up all required fields!" });
            setTimeout(() => setResponse({ status: "", message: "" }), 1500);
            return;
        };

        // SET LOADER
        setResponse({ status: "", message: "" });
        setLoading({ ...loading, mainLoading: true });
        const selectedProducts = orderProducts?.map(product => product._id)
        
        // MAKE REQUEST
        try {
            const res = await fetch(`${BASE_API_URL}/orders/record`, {
                headers,
                method: "POST",
                body: JSON.stringify({
                    description,
                    ...orderData,
                    channel: channel[0]?.value,
                    products: selectedProducts,
                    paymentMethod: paymentMethod[0]?.value,
                    customer: orderCustomer[0]?._id || null,
                    deliveryStatus: deliveryStatus[0]?.value,
                })
            });
            if(!res.ok) throw new Error('Something went wrong! Check intenet connection');

            const data = await res.json();
            console.log(res, data)
            
            const { status, message } = data;
            if(status !== 'success') throw new Error(message);

            // SET RESPONSE MESSAGE
            setResponse({ status: "success", message });
            setShowConfetti(true)

            window.scrollTo(0, 0);
            handleClearFields();
            
            setTimeout(() => navigate(-1), 3000);
            handleFetchUserStoreOrders()

        } catch(err) {
            setResponse({ status: "error", message: err.message });
        } finally {
            setLoading({ ...loading, mainLoading: false })
        }
    }


    return (
        <>

            {showConfetti &&  <ConfettiUI />}
            {loading.mainLoading && <Spinner />}

            {(response.message || response.status) && (
                <CustomAlert type={response.status} message={response.message} />
            )}

            {showModal.product && (
                <FullScreen style={{ maxWidth: '105rem', margin: '0 auto' }}>
                    <UploadProduct isModal close={() => handleCloseModal("product")} />
                </FullScreen>
            )}

            {showModal.customer && (
                <Drawer title='Add Customer'>
                    <AddCustomer />
                </Drawer>
            )}

            <section className='product__upload-section'>
                <div className='page__section--heading'>
                    <span className='flex'>
                        <BackButton />
                        <h2 className="page__section--title">Record Orders<MdOutlineShoppingBag /></h2>
                    </span>

                    {width > 600 && (
                        <div className="page__section--actions">
                            <button className='button clear--button' onClick={handleClearFields}>Clear Fields</button>
                            <button className='button submit--button' onClick={handleRecordOrder}>Submit</button>
                        </div>
                    )}
                </div>


                <div className="product__upload--container">
                    <div className='left--container containers'>
                        <div className="card form">
                            <div className="section--heading">
                                <h2>Order Item</h2>
                                {width > 400 && <Line border={1.4} where="Top" value="1rem" />}

                            </div>


                            <div className="form--item">
                                <label className="form--label">Product <Asterisk /></label>

                                <MainDropdownSelect title="Product" options={publishedProducts} field="name" value={orderProducts} setValue={setOrderProducts} noDataLabel="No product found!" multiple={true} />
                                <span className="form--error-message">
                                    {salesFormErrors.orderProducts && salesFormErrors.orderProducts}
                                </span>

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
                                    {/* <DatePicker format="MM/dd/yyyy" className='form--input' placeholder="Select date" /> */}
                                    <span className="form--error-message">
                                        {salesFormErrors.orderDate && salesFormErrors.orderDate}
                                    </span>
                                </div>
                            </div>


                            <div className="form--item">
                                <label className="form--label">Customer (optional)</label>
                                <MainDropdownSelect title="Customer" options={customers} field="name" value={orderCustomer} setValue={setOrderCustomer} noDataLabel='No customer found!' />
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


                {width < 600 && (
                    <div className="page__section--actions" style={{ marginTop: "4rem" }}>
                        <button className='button clear--button' onClick={handleClearFields}>Clear Fields</button>
                        <button className='button submit--button' onClick={handleRecordOrder}>Submit</button>
                    </div>
                )}
            </section>
        </>
    )
}

export default RecordOrder