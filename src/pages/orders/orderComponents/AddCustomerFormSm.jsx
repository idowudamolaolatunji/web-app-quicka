
import React, { useState } from 'react'
import { useAuthContext } from '../../../context/AuthContext';
import Asterisk from '../../../components/Asterisk';
import PhoneInput from 'react-phone-input-2';

import Spinner from "../../../components/spinner/simple";
import CustomAlert from '../../../components/CustomAlert';
import { createPortal } from 'react-dom';
import { validateCustomerForm } from '../../../utils/validationHelper';
import { useFetchedContext } from '../../../context/FetchedContext';



const BASE_API_URL = import.meta.env.VITE_API_URL;

function AddCustomerFormSm({ close }) {

    const { token, store } = useAuthContext();
    const { handleFetchUserStoreCustomers } = useFetchedContext()
    const { countryCode } = store?.contact;

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    }

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({ status: null, message: null });

    const [customerFormErrors, setCustomerFormErrors] = useState({});
    const [customerData, setCustomerData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        phoneNumber: "",
        dialCode: "",
        countryCode: "",
        country: ""
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
            country: "",
        });

    }


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


    async function handleCreateCustomer() {
        const formData = { ...customerData }
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

        const { countryCode, dialCode, phoneNumber, phone, email, country, firstname, lastname, description } = customerData;
        const contact = { countryCode, dialCode, phoneNumber, phone, email };
        const shippingAddress = { country }

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

            if (!res.ok) throw new Error('Something went wrong, Sever Error!');

            const data = await res.json();
            const { status, message } = data;
            if (!status || status != 'success') throw new Error(message);

            // SET RESPONSE MESSAGE
            setResponse({ status, message });
            handleClearFields();

            setTimeout(() => close(), 1000);
            handleFetchUserStoreCustomers()

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

                    <input type='text' id='country' name='country' placeholder='Enter Country' className='form--input' value={customerData.country} onChange={handleCustomerData} />
                    <span className="form--error-message">
                        {customerFormErrors?.country && customerFormErrors?.country}
                    </span>
                </div>

                <div className="page__section--actions" style={{ marginTop: "2.4rem" }}>
                    <button className='button clear--button' onClick={handleClearFields}>Clear Fields</button>
                    <button className='button submit--button' onClick={handleCreateCustomer}>{loading ? <Spinner /> : "Submit"}</button>
                </div>
            </div>

        </>
    )
}

export default AddCustomerFormSm