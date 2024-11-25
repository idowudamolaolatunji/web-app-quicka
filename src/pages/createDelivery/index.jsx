import React, { useEffect, useState } from 'react'
import CurrencyInput from 'react-currency-input-field';
import Asterisk from '../../components/Asterisk';
import QuillEditor from '../../components/QuillEditor';
import { useWindowSize } from 'react-use';
import Line from '../../components/Line';
import { FaCheck } from 'react-icons/fa';
import { TbTruckDelivery } from 'react-icons/tb';
import { useAuthContext } from '../../context/AuthContext';
import { validateDeliveryForm } from '../../utils/validationHelper';
import { useNavigate } from 'react-router-dom';
import { useFetchedContext } from '../../context/FetchedContext';
import AddPageUI from '../../ui/PageUI/AddPageUI';
import isOnline from 'is-online';


const BASE_API_URL = import.meta.env.VITE_API_URL;


function index({ close, isnew, isModal }) {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { headers, store, handleStore, shouldKick } = useAuthContext();
    const { handleFetchUserStoreDeliveryRates } = useFetchedContext();

    const { currencies, mainCurrency } = store;
    const currency = currencies[mainCurrency]?.symbol;

    const [showConfetti, setShowConfetti] = useState(false)
    const [deliveryFormErrors, setdeliveryFormErrors] = useState({})
    const [deliveryData, setDeliveryData] = useState({
        title: "",
        deliveryType: "paid",
        fee: null,
        visibility: true
    });

    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState({
        mainLoading: false,
        imageLoading: false
    });

    const [response, setResponse] = useState({
        status: null,
        message: null
    });


    function handleClearFields() {
        setDeliveryData({
            title: "",
            deliveryType: "paid",
            fee: null,
            visibility: true
        });

        setDescription("");
        window.scrollTo(0, 0)
    }

    useEffect(function () {
        !isnew && window.scrollTo(100, 0);
    }, []);


    async function handleCreateDelivery() {
        // FORM VALIDATIONS 
        const newErrors = validateDeliveryForm(deliveryData);
        setdeliveryFormErrors(newErrors);

        if (Object.keys(newErrors).length >= 1) {
            setResponse({ status: "error", message: "Fill required fields to proceed!" });
            setTimeout(() => setResponse({ status: "", message: "" }), 5000);
            return;
        };


        // SET LOADER
        setResponse({ status: "", message: "" });
        setLoading({ ...loading, mainLoading: true });
        const connected = await isOnline();
        if(!connected) throw new Error("Check your internet connection");

        const end_point = isnew ? "onboard/rate" : ""

        // MAKE REQUEST
        try {
            const res = await fetch(`${BASE_API_URL}/delivery-rates/${end_point}`, {
                headers,
                method: "POST",
                body: JSON.stringify({
                    description,
                    ...deliveryData,
                    fee: +deliveryData.fee,
                })
            });

            shouldKick(res)
            if (!res.ok) throw new Error('Something went wrong, Sever Error!');

            const data = await res.json();
            const { status, message } = data;
            if (!status || status != 'success') throw new Error(message);
            
            // SET RESPONSE MESSAGE
            handleClearFields();
            window.scrollTo(0, 0);
            isnew && setShowConfetti(true);
            setResponse({ status: "success", message });
            handleFetchUserStoreDeliveryRates()
            
            // MODIFY THE STORE IN THE COOKIE
            if(isnew) {
                const { store } = data?.data;
                handleStore(store);
            }

            setTimeout(function () {
                if (isnew) close();
                else navigate(-1)
            }, isnew ? 5000 : 3000);

        } catch (err) {
            setResponse({ status: "error", message: err.message });
        } finally {
            setLoading({ ...loading, mainLoading: false })
        }
    }


    return (
        <AddPageUI
            pageTitle="Set Delivery Rate"
            pageIcon={<TbTruckDelivery />}
            close={close} isnew={isnew}
            justify isModal={isModal}
            mainLoader={loading.mainLoading}
            response={response}
            handleClear={handleClearFields}
            handleSubmit={handleCreateDelivery}
            confetti={showConfetti}
        >

            <div className="product__upload--container">
                {width < 400 && <Line border={1.4} />}

                <div className='left--container containers'>
                    <div className="card form">
                        <div className="section--heading">
                            <h2>Delivery Details</h2>
                            {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                        </div>

                        <div className="form--item">
                            <label htmlFor="title" className="form--label">Delivery Title <Asterisk /></label>
                            <input type="text" id="title" className="form--input" placeholder='Lagos Ikeja - Location One' value={deliveryData.title} onChange={e => setDeliveryData({ ...deliveryData, title: e.target.value })} />
                            <span className="form--error-message">
                                {deliveryFormErrors.title && deliveryFormErrors.title}
                            </span>
                        </div>

                        <div className="form--item">
                            <label className="form--label">Delivery Pricing (optional)</label>
                            <div className="form--clicks" style={width < 450 ? { gridTemplateColumns: "1fr 1fr" } : {}}>
                                <div className={`form--click ${deliveryData.deliveryType == "paid" ? 'is-selected' : ''}`} onClick={() => setDeliveryData({ ...deliveryData, deliveryType: "paid" })}
                                >Paid <span></span>
                                </div>
                                <div className={`form--click ${deliveryData.deliveryType == "free" ? 'is-selected' : ''}`} onClick={() => setDeliveryData({ ...deliveryData, deliveryType: "free" })}
                                >Free Delivery<span></span>
                                </div>
                            </div>
                        </div>

                        {deliveryData.deliveryType == "paid" && (
                            <div className="form--item">
                                <label htmlFor="fee" className="form--label">Delivery Fee <Asterisk /></label>

                                <CurrencyInput
                                    id="fee"
                                    name="fee"
                                    className="form--input"
                                    placeholder="Delivery Fee"
                                    prefix={currency}
                                    decimalsLimit={0}
                                    onValueChange={(value, name, _) => setDeliveryData({ ...deliveryData, [name]: value })}
                                />
                                <span className="form--error-message">
                                    {deliveryFormErrors.fee && deliveryFormErrors.fee}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {width < 400 && <Line border={1.4} />}

                <div className='right--container containers'>
                    <div className="card form">
                        <div className="section--heading">
                            <h2>Delivery Descriptions</h2>
                            {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                        </div>


                        <div className="form--item">
                            <label htmlFor="" className="form--label">Description (optional)</label>
                            <QuillEditor value={description} setValue={setDescription} />
                        </div>


                        <div className="form--item-flex" onClick={() => setDeliveryData({ ...deliveryData, visibility: !deliveryData.visibility })}>
                            <div id="checkbox" className={deliveryData.visibility ? 'is-selected' : ''}>
                                {deliveryData.visibility && <FaCheck />}
                            </div>
                            <label className='form--text' style={{ fontSize: '1.24rem', fontWeight: '500' }}>Display this rate at website checkout</label>
                        </div>
                    </div>
                </div>
            </div>

        </AddPageUI>
    )
}

export default index