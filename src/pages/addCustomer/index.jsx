import React, { useState, useEffect } from 'react'
import { useDataContext } from '../../context/DataContext';
import MainDropdownSelect from '../../components/form/MainDropdownSelect';
import { FiUsers } from 'react-icons/fi';
import { useWindowSize } from 'react-use';
import Line from '../../components/elements/Line';
import Asterisk from '../../components/elements/Asterisk';
import PhoneInput from 'react-phone-input-2';
import { validateCustomerForm } from '../../utils/validationHelper';
import { useAuthContext } from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetchedContext } from '../../context/FetchedContext';
import AddPageUI from '../../ui/PageUI/AddPageUI';
import isOnline from 'is-online';


const BASE_API_URL = import.meta.env.VITE_API_URL;

function index({ close, isModal }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { headers, store, shouldKick } = useAuthContext();
    const { location, getContries, getStates, getCities, setLocation } = useDataContext();
    const { handleFetchMyStoreCustomers, handleFetchError, handleFetchOneItem } = useFetchedContext();

    const { countryCode } = store?.contact;

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({
        status: null,
        message: null
    });

    const [country, setCountry] = useState([]);
    const [state, setState] = useState([]);
    const [city, setCity] = useState([]);


    const [customerFormErrors, setCustomerFormErrors] = useState({});
    const [customerData, setCustomerData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        phoneNumber: "",
        dialCode: "",
        countryCode: "",
        description: "",
        address: "",
        zipCode: ""
    });


    const handleCustomerData = function (e, val, opts) {
        if (!e && (val || opts)) {
            const { dialCode, countryCode } = opts;
            const phone = val?.startsWith(dialCode + '0') ? val?.replace(dialCode + '0', dialCode) : val;
            const phoneNumber = phone?.replace(dialCode, "");

            setCustomerData({ ...customerData, phone: phone, phoneNumber, dialCode, countryCode });
            return;
        }

        const { name, value } = e?.target;
        setCustomerData({
            ...customerData,
            [name]: value,
        });
    };


    const handleClearFields = function() {
        setCustomerData({
            firstname: "",
            lastname: "",
            email: "",
            phone: "",
            phoneNumber: "",
            dialCode: "",
            countryCode: "",
            description: "",
            address: "",
            zipCode: ""
        });

        setCountry([]);
        setState([]);
        setCity([]);
        window.scrollTo(0, 0)
    }


    useEffect(function() {
        document.title = "Quicka | Add Customer"
    }, [])

    
    // fetching the item if id is given
    useEffect(function() {
        (async () => {
            if(id) {
                setLoading(true);
                const fetchedItem = await handleFetchOneItem("customer", id);
                setLoading(false);

                if(fetchedItem) {
                    setCustomerData({
                        firstname: fetchedItem?.firstname || "",
                        lastname: fetchedItem?.lastname || "",
                        email: fetchedItem?.contact?.email || "",
                        phone: fetchedItem?.contact?.phone || "",
                        phoneNumber: fetchedItem?.contact?.phoneNumber || "",
                        dialCode: fetchedItem?.contact?.dialCode || "",
                        countryCode: fetchedItem?.contact?.countryCode || "",
                        description: fetchedItem?.description || "",
                        address: fetchedItem?.shippingAddress?.address || "",
                        zipCode: fetchedItem?.shippingAddress?.zipCode || ""
                    });

                    const { country, state, city } = fetchedItem?.shippingAddress;

                    setCountry(country ? [country] : []);
                    setState(state ? [state] : []);
                    setCity(city ? [city] : []);
                }
            }
        })();

    }, [id]);


    useEffect(function () {
        setState([]);
        setCity([]);
        setLocation({ ...location, state: [], city: [] });

        getContries()
    }, []);


    useEffect(function () {
        if(!id) {
            setState([]);
            setCity([]);
            setLocation({ ...location, state: [], city: [] });
        }

        if (country.length > 0) {
            getStates(country[0]?.iso2)
        }
    }, [country[0], id]);

    
    useEffect(function () {
        if(!id) {
            setCity([]);
            setLocation({ ...location, city: [] });
        }

        if(!state[0]?.iso2) return;

        if (country.length > 0 && state.length > 0) {
            getCities(country[0]?.iso2, state[0]?.iso2);
        }
    }, [country[0], state[0], id]);



    async function handleCreateCustomer() {
        const formData = { ...customerData, country }
        // FORM VALIDATIONS 
        const newErrors = validateCustomerForm(formData);
        setCustomerFormErrors(newErrors);

        if (Object.keys(newErrors).length >= 1) {
            setResponse({ status: "error", message: "Fill required fields to proceed!" });
            setTimeout(() => setResponse({ status: "", message: "" }), 5000);
            return;
        };

        // SET LOADER
        setResponse({ status: "", message: "" });
        setLoading(true);

        const { countryCode, dialCode, phoneNumber, phone, email, address, zipCode, firstname, lastname, description } = customerData;
        const contact = { countryCode, dialCode, phoneNumber, phone, email };
        const shippingAddress = { address, zipCode, country: country[0], state: state[0], city: city[0] }
        

        const end_point = id ? id : ""

        try {
            // CHECK CONNECTION
            const connected = await isOnline();
            if(!connected) throw new Error("Internet Error");

            // MAKE REQUEST
            const res = await fetch(`${BASE_API_URL}/customers/${end_point}`, {
                headers,
                method: id ? "PATCH" : "POST",
                body: JSON.stringify({
                    contact, shippingAddress,
                    firstname, lastname, description
                })
            });
            shouldKick(res);

            const data = await res.json();
            const { status, message } = data;
            if (!status || status != 'success') throw new Error(message);

            // SET RESPONSE MESSAGE
            setResponse({ status, message });
            handleClearFields();
            
            setTimeout(() => navigate(-1), 3000);
            handleFetchMyStoreCustomers()

        } catch (err) {
            const message = handleFetchError(err?.message)
            setResponse({ status: "error", message });
        } finally {
            setLoading(false)
        }
    }


    return (
        <AddPageUI
            pageTitle={`${id ? "Edit" : "Add"} Customer`}
            pageIcon={<FiUsers />}
            close={close} 
            isModal={isModal}
            mainLoader={loading}
            response={response}
            handleClear={handleClearFields}
            handleSubmit={handleCreateCustomer}
            hasExplainer={id ? false : true}
            btnBelow={false}
        >

            <div className="product__upload--container">
                {width < 400 && <Line border={1.4} />}

                <div className='left--container containers'>
                    <div className="card form">
                        <div className="section--heading">
                            <h2>Customer Details</h2>
                            {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                        </div>


                        <div className="form--grid">
                            <div className="form--item">
                                <label htmlFor="firstname" className="form--label">Firstname <Asterisk /></label>
                                <input type="text" id="firstname" name='firstname' className="form--input" placeholder='Taiwo' value={customerData.firstname} onChange={handleCustomerData} />
                                <span className="form--error-message">
                                    {customerFormErrors?.firstname && customerFormErrors?.firstname}
                                </span>
                            </div>
                            <div className="form--item">
                                <label htmlFor="lastname" className="form--label">Lastname <Asterisk /></label>
                                <input type="text" id="lastname" name='lastname' className="form--input" placeholder='Matthew' value={customerData.lastname} onChange={handleCustomerData} />
                                <span className="form--error-message">
                                    {customerFormErrors?.lastname && customerFormErrors?.lastname}
                                </span>
                            </div>
                     
                            <div className="form--item">
                                <label htmlFor="email" className="form--label">Email Address <Asterisk /></label>
                                <input type="email" id="email" name='email' className="form--input" placeholder='Taiwo@mail.com' value={customerData.email} onChange={handleCustomerData} />
                                <span className="form--error-message">
                                    {customerFormErrors?.email && customerFormErrors?.email}
                                </span>
                            </div>

                            <div className="form--item">
                                <label htmlFor="phone" className="form--label">Phone Number <Asterisk /></label>

                                <PhoneInput
                                    country={countryCode}
                                    value={customerData.phone}
                                    inputProps={{ name: 'phone', id: 'phone' }}
                                    onChange={(num, countryOpts) => handleCustomerData(null, num, countryOpts)}
                                    inputClass='phone-input'
                                    buttonStyle={{ backgroundColor: 'transparent', border: 'none', paddingLeft: '.4rem', height: '4rem', margin: '.2rem 0' }}
                                    countryCodeEditable={true}
                                    dropdownStyle={{ top: '100%', marginTop: 0, borderRadius: '.4rem', padding: '.2rem' }}
                                />
                                <span className="form--error-message">
                                    {customerFormErrors?.phone && customerFormErrors?.phone}
                                </span>
                            </div>
                        </div>

                        <div className="form--item">
                            <label htmlFor='description' className="form--label">Addtional Note (optional)</label>
                            <textarea name="description" id="description" placeholder='Additional...' className='form--input' value={customerData.description} onChange={handleCustomerData} />
                        </div>

                    </div>
                </div>

                {width < 400 && <Line border={1.4} />}

                <div className='right--container containers'>
                    <div className="card form">
                        <div className="section--heading">
                            <h2>Customer Delivery Details</h2>
                            {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                        </div>

                        <div className="form--item">
                            <label htmlFor='address' className="form--label">Delivery Address (optional)</label>
                            
                            <textarea id='address' name='address' className="form--input" placeholder='Block 12, Flat 3, Libra Estate, Lagos State Nigeria' value={customerData.address} onChange={handleCustomerData} />
                        </div>

                        <div className="form--grid">
                            <div className="form--item">
                                <label className="form--label">Country <Asterisk /></label>

                                <MainDropdownSelect title="a Country" options={location?.country} field="name" value={country} setValue={setCountry} customClass='select-width' noDataLabel='Loading...' />
                                <span className="form--error-message">
                                    {customerFormErrors?.country && customerFormErrors?.country}
                                </span>
                            </div>

                            <div className="form--item">
                                <label className="form--label">State (optional)</label>

                                <MainDropdownSelect title="a state" options={location?.state} field="name" value={state} setValue={setState} customClass='select-width' noDataLabel="Choose country, Loading..." />
                            </div>

                            <div className="form--item">
                                <label className="form--label">City (optional)</label>

                                <MainDropdownSelect title="a city" options={location?.city} field="name" value={city} setValue={setCity} customClass='select-width' noDataLabel='Choose state, Loading...' />
                            </div>


                            <div className="form--item">
                                <label htmlFor='zip' className="form--label">Zip Code (optional)</label>

                                <input type='number' id='zip' name='zipCode' placeholder='Zipcode' className='form--input' value={customerData.zipCode} onChange={handleCustomerData} />
                            </div>

                        </div>

                    </div>
                </div>
            </div>

        </AddPageUI>
    )
}

export default index