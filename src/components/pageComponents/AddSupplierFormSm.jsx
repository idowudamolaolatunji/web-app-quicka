
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
import Tab from '../elements/Tab';
import { GiEnvelope } from "react-icons/gi";
import { AiFillInstagram, AiFillTikTok } from 'react-icons/ai';
import { FaSnapchatSquare } from "react-icons/fa";
import Info from '../elements/Info';



const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function AddSupplierFormSm({ close }) {
    const { headers, store, shouldKick } = useAuthContext();
    const { handleFetchMyStoreCustomers } = useFetchedContext()
    const { location, setLocation, getContries } = useDataContext();
    const { countryCode } = store?.contact;

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({ status: null, message: null });
    const [country, setCountry] = useState([]);
    const [selectedInfo, setSelectedInfo] = useState({ email: false, instagram: true, tiktok: false, snapchat: false });

    const [supplierFormErrors, setSupplierFormErrors] = useState({});
    const [supplierData, setSupplierData] = useState({
        fullname: "",
        location: "",
        phone: "",
        dialCode: "",
        countryCode: "",
    });


    const handleClearFields = function () {
        setSupplierData({
            fullname: "",
            location: "",
            phone: "",
            dialCode: "",
            countryCode: "",
        });

        setCountry([]);
        setSelectedInfo({ email: false, instagram: true, tiktok: false, snapchat: false });
        setSupplierFormErrors({});
    }

    const handleSelectedInfo = function(tab) {
        const selected = Object.values(selectedInfo).filter(info => info);
        if (selected.length < 3 && !selectedInfo[tab])
            setSelectedInfo((prev) => ({ ...prev, [tab]: true }));
        if (selected.length > 0 && selectedInfo[tab]) 
            setSelectedInfo((prev) => ({ ...prev, [tab]: false }));
    }


    const handleSupplierData = function (e, val, opts) {
        if (!e && (val || opts)) {
            console.log(opts)
            const { dialCode, countryCode } = opts;
            const phone = val?.startsWith(dialCode + '0') ? val?.replace(dialCode + '0', dialCode) : val;

            setSupplierData({ ...supplierData, phone: phone, dialCode, countryCode });
            return;
        }

        const { name, value } = e?.target;
        setSupplierData({
            ...supplierData,
            [name]: value,
        });
    };

    useEffect(function () {
        setLocation({ ...location, state: [], city: [] });

        getContries()
    }, []);

    async function handleCreateCustomer() {
        const formData = { ...supplierData, country }
        // FORM VALIDATIONS 
        const newErrors = validateCustomerForm(formData);
        setSupplierFormErrors(newErrors);

        if (Object.keys(newErrors).length >= 1) {
            setResponse({ status: "error", message: "Fill required fields to proceed!" });
            setTimeout(() => setResponse({ status: "", message: "" }), 5000);
            return;
        };

        // SET LOADER
        setResponse({ status: "", message: "" });
        setLoading(true)

        const { countryCode, dialCode, phone, email, firstname, lastname, description } = supplierData;
        const contact = { countryCode, dialCode, phone, email };
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

            // CLEAR FIELDS AND SET RESPONSE MESSAGE
            handleClearFields();
            setResponse({ status, message });
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
                    <label htmlFor="fullname" className="form--label">Fullname <Asterisk /></label>
                    <input type="text" id="fullname" name='fullname' className="form--input" placeholder='Taiwo Waxwell' value={supplierData.fullname} onChange={handleSupplierData} />
                    <span className="form--error-message">
                        {supplierFormErrors?.fullname && supplierFormErrors?.fullname}
                    </span>
                </div>
                

                <div className="form--item">
                    <label htmlFor="phone" className="form--label">Phone Number <Asterisk /></label>

                    <PhoneInput
                        country={countryCode}
                        value={supplierData.phone}
                        inputProps={{ name: 'phone', id: 'phone' }}
                        onChange={(num, countryOpts) => handleSupplierData(null, num, countryOpts)}
                        inputClass='phone-input'
                        buttonStyle={{ backgroundColor: 'transparent', border: 'none', paddingLeft: '.4rem', height: '4rem', margin: '.2rem 0' }}
                        countryCodeEditable={true}
                        dropdownStyle={{ top: '100%', marginTop: 0, borderRadius: '.4rem', padding: '.2rem' }}
                    />
                    <span className="form--error-message">
                        {supplierFormErrors?.phone && supplierFormErrors?.phone}
                    </span>
                </div>

                <div className="form--item">
                    <label htmlFor='location' className="form--label">Location <Asterisk /></label>

                    <input type='text' name='location' placeholder='Block 7, Sangotedo Ajah Lagos' className='form--input' value={supplierData.location} onChange={handleSupplierData} />
                    <span className="form--error-message">
                        {supplierFormErrors?.location && supplierFormErrors?.location}
                    </span>
                </div>

                <div className="form--item" style={{ gap: "1.4rem" }}>
                    <label className="form--label">Contact info (optional)</label>

                    <div className="tabs">
                        <Tab title={<><GiEnvelope /> Email</>} active={selectedInfo.email} onClick={() => handleSelectedInfo("email")} />
                        <Tab title={<><AiFillInstagram />Instagram</>} active={selectedInfo.instagram} onClick={() => handleSelectedInfo("instagram")} />
                        <Tab title={<><AiFillTikTok />Tiktok</>} active={selectedInfo.tiktok} onClick={() => handleSelectedInfo("tiktok")} />
                        <Tab title={<><FaSnapchatSquare />SnapChat</>} active={selectedInfo.snapchat} onClick={() => handleSelectedInfo("snapchat")} />
                    </div>
                    <Info text="Select at most three (3) contact info or leave empty" />
                    
                    {selectedInfo.email && <input type='text' name='email' placeholder='Enter email' className='form--input' value={supplierData.country} onChange={handleSupplierData} />}
                    {selectedInfo.instagram && <input type='text' name='instagram' placeholder='@quickabusiness' className='form--input' value={supplierData.country} onChange={handleSupplierData} />}
                    {selectedInfo.tiktok && <input type='text' name='country' placeholder='@' className='form--input' value={supplierData.country} onChange={handleSupplierData} />}
                    {selectedInfo.snapchat && <input type='text' name='country' placeholder='Enter Country' className='form--input' value={supplierData.country} onChange={handleSupplierData} />}
                    
                </div>

                <div className="page__section--actions">
                    <button className='button clear--button' onClick={handleClearFields}>Clear Fields</button>
                    <button className='button submit--button' onClick={handleCreateCustomer} disabled={loading}>{loading ? <Spinner /> : "Submit"}</button>
                </div>
            </div>

        </>
    )
}