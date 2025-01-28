
import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../../context/AuthContext';
import Asterisk from '../../components/elements/Asterisk';
import PhoneInput from 'react-phone-input-2';

import Spinner from "../../components/spinner/simple";
import CustomAlert from '../../components/layout/CustomAlert';
import { createPortal } from 'react-dom';
import { validateCustomerForm } from '../../utils/validationHelper';
import { useFetchedContext } from '../../context/FetchedContext';
import MainDropdownSelect from '../form/MainDropdownSelect';
import { useDataContext } from '../../context/DataContext';


const BASE_API_URL = import.meta.env.VITE_API_URL;

function AddCustomerFormSm({ close }) {
    const { headers, store, shouldKick } = useAuthContext();
    const { handleFetchMyStoreCustomers } = useFetchedContext()
    const { location, setLocation, getContries } = useDataContext();
    const { countryCode } = store?.contact;

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({ status: null, message: null });
    const [country, setCountry] = useState([]);

    const [customerFormErrors, setCustomerFormErrors] = useState({});
    const [customerData, setCustomerData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        phoneNumber: "",
        dialCode: "",
        countryCode: "",
    });


    const handleClearFields = function () {
        setCustomerData({
            firstname: "",
            lastname: "",
            email: "",
            phone: "",
            phoneNumber: "",
            dialCode: "",
            countryCode: "",
        });

        setCountry([]);
    }


    const handleCustomerData = function (e, val, opts) {
        if (!e && (val || opts)) {
            console.log(opts)
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

    useEffect(function () {
        setLocation({ ...location, state: [], city: [] });

        getContries()
    }, []);


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
        setLoading(true)

        const { countryCode, dialCode, phoneNumber, phone, email, firstname, lastname, description } = customerData;
        const contact = { countryCode, dialCode, phoneNumber, phone, email };
        const shippingAddress = { country: country[0] }

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

            shouldKick(res);
            const data = await res.json();
            const { status, message } = data;
            if (!status || status != 'success') throw new Error(message);

            // SET RESPONSE MESSAGE
            setResponse({ status, message });
            handleClearFields();

            setTimeout(() => close(), 1000);
            handleFetchMyStoreCustomers()

        } catch (err) {
            setResponse({ status: "error", message: err.message });
        } finally {
            setLoading(false)
        }
    }


    return (
        <>
            {(response.message || response.status) && (
                createPortal(<CustomAlert type={response.status} message={response.message} />, document.body)
            )}

            <div className='modal--form'>
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


                <div className="form--item">
                    <label htmlFor='country' className="form--label">Country <Asterisk /></label>

                    {/* <input type='text' id='country' name='country' placeholder='Enter Country' className='form--input' value={customerData.country} onChange={handleCustomerData} /> */}
                    <MainDropdownSelect title="a Country" options={location?.country} field="name" value={country} setValue={setCountry} noDataLabel='Loading...' />
                    <span className="form--error-message">
                        {customerFormErrors?.country && customerFormErrors?.country}
                    </span>
                </div>

                <div className="page__section--actions">
                    <button className='button clear--button' onClick={handleClearFields}>Clear Fields</button>
                    <button className='button submit--button' onClick={handleCreateCustomer}>{loading ? <Spinner /> : "Submit"}</button>
                </div>
            </div>

        </>
    )
}

export default AddCustomerFormSm