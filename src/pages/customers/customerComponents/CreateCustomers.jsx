import React, { useState, useEffect } from 'react'
import { useDataContext } from '../../../context/DataContext';
import MainDropdownSelect from '../../../components/MainDropdownSelect';
import { FiUsers } from 'react-icons/fi';
import { useWindowSize } from 'react-use';
import Line from '../../../components/Line';
import AddPageUI from '../../pageUIComponents/AddPageUI';
import Asterisk from '../../../components/Asterisk';
import PhoneInput from 'react-phone-input-2';
import { validateCustomerForm } from '../../../utils/validationHelper';
import { useAuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const BASE_API_URL = import.meta.env.VITE_API_URL;

function CreateCustomers({ close, isModal }) {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { token, store } = useAuthContext();
    const { location, getContries, getStates, getCities, setLocation } = useDataContext();

    const { countryCode } = store?.contact;

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    }

    const [loading, setLoading] = useState({
        mainLoading: false,
        imageLoading: false
    });
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
    }


    useEffect(function () {
        setState([]);
        setCity([]);
        setLocation({ ...location, state: [], city: [] });

        getContries()
    }, []);


    useEffect(function () {
        setState([]);
        setCity([]);
        setLocation({ ...location, state: [], city: [] });

        if (country.length > 0) {
            getStates(country[0]?.iso2)
        }
    }, [country[0]]);

    
    useEffect(function () {
        setCity([]);
        setLocation({ ...location, city: [] });

        if (country.length > 0 && state.length > 0) {
            getCities(country[0]?.iso2, state[0]?.iso2);
        }
    }, [country[0], state[0]]);



    async function handleCreateCustomer() {
        const formData = { ...customerData, country }
        // FORM VALIDATIONS 
        const newErrors = validateCustomerForm(formData);
        setCustomerFormErrors(newErrors);

        if (Object.keys(newErrors).length >= 1) {
            setResponse({ status: "error", message: "Fill required fields to proceed!" });
            setTimeout(() => setResponse({ status: "", message: "" }), 3000);
            return;
        };

        // SET LOADER
        setResponse({ status: "", message: "" });
        setLoading({ ...loading, mainLoading: true });

        const { countryCode, dialCode, phoneNumber, phone, email, address, zipCode, firstname, lastname, description } = customerData;
        const contact = { countryCode, dialCode, phoneNumber, phone, email };
        const shippingAddress = { address, zipCode, country: country[0]?.name, state: state[0]?.name, city: city[0]?.name }

        // MAKE REQUEST
        try {
            const res = await fetch(`${BASE_API_URL}/customers`, {
                headers,
                method: "POST",
                body: JSON.stringify({
                    contact, shippingAddress,
                    firstname, lastname, description
                })
            });

            if (!res.ok) throw new Error('Something went wrong! Check intenet connection');
            console.log(res)

            const data = await res.json();
            const { status, message } = data;
            if (!status || status != 'success') throw new Error(message);

            // SET RESPONSE MESSAGE
            setResponse({ status, message });
            handleClearFields();
            
            setTimeout(() => navigate(-1), 5000);

        } catch (err) {
            setResponse({ status: "error", message: err.message });
        } finally {
            setLoading({ ...loading, mainLoading: false })
        }
    }


    return (
        <AddPageUI
            PageTitle="Add Customer"
            pageIcon={<FiUsers />}
            close={close} 
            isModal={isModal}
            mainLoader={loading.mainLoading}
            response={response}
            handleClear={handleClearFields}
            handleSubmit={handleCreateCustomer}
        >

            <div className="product__upload--container">
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

                                <MainDropdownSelect title="a Country" options={location?.country} field="name" value={country} setValue={setCountry} customClass='select-width' />
                                <span className="form--error-message">
                                    {customerFormErrors?.country && customerFormErrors?.country}
                                </span>
                            </div>

                            <div className="form--item">
                                <label className="form--label">State (optional)</label>

                                <MainDropdownSelect title="a state" options={location?.state} field="name" value={state} setValue={setState} noDataLabel='No states' disabled={country?.length < 1} customClass='select-width' />
                            </div>

                            <div className="form--item">
                                <label className="form--label">City (optional)</label>

                                <MainDropdownSelect title="a city" options={location?.city} field="name" value={city} setValue={setCity} noDataLabel='No Cities' disabled={state?.length < 1} customClass='select-width' />
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

export default CreateCustomers