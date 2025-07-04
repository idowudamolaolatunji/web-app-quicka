
import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../../context/AuthContext';
import Asterisk from '../../components/elements/Asterisk';
import PhoneInput from 'react-phone-input-2';

import Spinner from "../../components/spinner/TallSpin";
import CustomAlert from '../../components/layout/CustomAlert';
import { createPortal } from 'react-dom';
import { validateCustomerForm } from '../../utils/validationHelper';
import { useFetchedContext } from '../../context/FetchedContext';
import MainDropdownSelect from '../form/MainDropdownSelect';
import { useDataContext } from '../../context/DataContext';
import { AiFillInstagram, AiFillTikTok } from 'react-icons/ai';
import { FaSnapchatSquare } from 'react-icons/fa';
import Tab from '../elements/Tab';
import LinkInput from '../form/LinkInput';
import Info from '../elements/Info';


const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function AddCustomerFormSm({ close }) {
    const { formdataHeader, store, shouldKick } = useAuthContext();
    const { handleFetchMyStoreCustomers } = useFetchedContext()
    const { location, setLocation, getContries } = useDataContext();

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({ status: null, message: null });
    const [country, setCountry] = useState(store?.location?.country ? [store?.location?.country] : []);
    const [selectedInfo, setSelectedInfo] = useState({ instagram: false, tiktok: false, snapchat: false });

    const [customerFormErrors, setCustomerFormErrors] = useState({});
    const [customerData, setCustomerData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        phoneNumber: "",
        dialCode: "",
        countryCode: "",
        instagram: "",
        tiktok: "",
        snapchat: ""
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
            instagram: "",
            tiktok: "",
            snapchat: ""
        });

        setCountry([]);
        setCustomerFormErrors({});
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

    const handleSelectedInfo = function(tab) {
        const selected = Object.values(selectedInfo).filter(info => info);
        if (selected.length < 2 && !selectedInfo[tab])
            setSelectedInfo((prev) => ({ ...prev, [tab]: true }));
        if (selected.length > 0 && selectedInfo[tab]) 
            setSelectedInfo((prev) => ({ ...prev, [tab]: false }));
    }

    useEffect(function () {
        setLocation({ ...location, state: [], city: [] });

        getContries()
    }, []);


    async function handleCreateCustomer() {
        // FORM VALIDATIONS 
        const newErrors = validateCustomerForm({ ...customerData, country });
        setCustomerFormErrors(newErrors);

        if (Object.keys(newErrors).length >= 1) {
            setResponse({ status: "error", message: "Fill required fields to proceed!" });
            setTimeout(() => setResponse({ status: "", message: "" }), 5000);
            return;
        };

        // SET LOADER
        setResponse({ status: "", message: "" });
        setLoading(true);

        const { countryCode, dialCode, phoneNumber, phone, email, firstname, lastname, description, instagram, tiktok, snapchat } = customerData;
        const contact = { countryCode, dialCode, phoneNumber, phone, email };
        const addressDetails = { country: country[0] };
        const socials = { instagram, tiktok, snapchat };

        const formData = new FormData();
        formData.append('firstname', firstname);
        formData.append('lastname', lastname);
        formData.append('description', description);
        formData.append('contact', JSON.stringify(contact));
        formData.append('addressDetails', JSON.stringify(addressDetails));
        formData.append('socials', JSON.stringify(socials));

        // MAKE REQUEST
        try {
            const res = await fetch(`${BASE_API_URL}/customers?slug=${store?.slug}`, {
                headers: formdataHeader,
                method: "POST",
                body: formData
            });

            shouldKick(res);
            const data = await res.json();
            const { status, message } = data;
            if (!status || status != 'success') throw new Error(message);

            // CLEAR FIELDS AND SET RESPONSE MESSAGE
            handleClearFields();
            setResponse({ status, message });
            setTimeout(() => close(), 500);
            handleFetchMyStoreCustomers()

        } catch (err) {
            setResponse({ status: "error", message: err.message });
        } finally {
            setLoading(false)
        }
    }


    return (
        <React.Fragment>
            {(response.message || response.status) && (
                createPortal(<CustomAlert type={response.status} message={response.message} />, document.body)
            )}

            <div className='modal--form'>
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
                        country={String(country[0]?.iso2).toLowerCase()}
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

                <div className="form--item" style={{ gap: "1.4rem" }}>
                    <label className="form--label">Socials (optional)</label>
                    <div className="tabs" style={{ justifyContent: "flex-start" }}>
                        <Tab title={<><AiFillInstagram />Instagram</>} active={selectedInfo.instagram} onClick={() => handleSelectedInfo("instagram")} />
                        <Tab title={<><AiFillTikTok />Tiktok</>} active={selectedInfo.tiktok} onClick={() => handleSelectedInfo("tiktok")} />
                        <Tab title={<><FaSnapchatSquare />SnapChat</>} active={selectedInfo.snapchat} onClick={() => handleSelectedInfo("snapchat")} />
                    </div>
                    <Info text="Select up to 2 social media platforms (optional, leave empty if none)" />
                    
                    {selectedInfo.instagram && <LinkInput url={<AiFillInstagram />} name="instagram" value={customerData.instagram} handleChange={handleCustomerData} linkPosition='start' placeholder="@ instagram handle" />}
                    {selectedInfo.tiktok && <LinkInput url={<AiFillTikTok />} name="tiktok" value={customerData.tiktok} handleChange={handleCustomerData} linkPosition='start' placeholder="@ tiktok profile" />}
                    {selectedInfo.snapchat && <LinkInput url={<FaSnapchatSquare />} name="snapchat" value={customerData.snapchat} handleChange={handleCustomerData} linkPosition='start' placeholder="@ snapchat handle" />}
                </div>

                <div className="form--item">
                    <label htmlFor='country' className="form--label">Country <Asterisk /></label>

                    <MainDropdownSelect title="a Country" options={location?.country} field="name" value={country} setValue={setCountry} noDataLabel='Loading...' />
                    <span className="form--error-message">
                        {customerFormErrors?.country && customerFormErrors?.country}
                    </span>
                </div>

                <div className="page__section--actions" style={{ marginTop: "1rem" }}>
                    <button className='button clear--button' onClick={handleClearFields} disabled={loading}>Clear Fields</button>
                    <button className={`button ${loading ? "spinner--button" : "submit--button"}`} onClick={handleCreateCustomer} disabled={loading}>{loading ? <Spinner /> : "Submit"}</button>
                </div>
            </div>

        </React.Fragment>
    )
}