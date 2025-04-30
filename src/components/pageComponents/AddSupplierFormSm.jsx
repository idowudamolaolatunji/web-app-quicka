
import React, { useState } from 'react'
import { useAuthContext } from '../../context/AuthContext';
import Asterisk from '../../components/elements/Asterisk';
import PhoneInput from 'react-phone-input-2';

import Spinner from "../../components/spinner/tallspin";
import CustomAlert from '../../components/layout/CustomAlert';
import { createPortal } from 'react-dom';
import { validateSuppllierForm } from '../../utils/validationHelper';
import { useFetchedContext } from '../../context/FetchedContext';
import Tab from '../elements/Tab';
import { GiEnvelope } from "react-icons/gi";
import { AiFillInstagram, AiFillTikTok } from 'react-icons/ai';
import { FaSnapchatSquare } from "react-icons/fa";
import Info from '../elements/Info';
import LinkInput from '../form/LinkInput';



const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function AddSupplierFormSm({ close }) {
    const { headers, store, shouldKick } = useAuthContext();
    const { handleFetchMyStoreSuppliers } = useFetchedContext()
    const { countryCode } = store?.contact;

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({ status: null, message: null });
    const [selectedInfo, setSelectedInfo] = useState({ email: false, instagram: true, tiktok: false, snapchat: false });

    const [supplierFormErrors, setSupplierFormErrors] = useState({});
    const [supplierData, setSupplierData] = useState({
        fullname: "",
        location: "",
        phone: "",
        dialCode: "",
        countryCode: "",
        email: "",
        instagram: "",
        tiktok: "",
        snapchat: "",
    });


    const handleClearFields = function () {
        setSupplierData({
            fullname: "",
            location: "",
            phone: "",
            dialCode: "",
            countryCode: "",
            email: "",
            instagram: "",
            tiktok: "",
            snapchat: "",
        });

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


    async function handleCreateCustomer() {
        // FORM VALIDATIONS 
        const newErrors = validateSuppllierForm(supplierData);
        setSupplierFormErrors(newErrors);

        if (Object.keys(newErrors).length >= 1) {
            setResponse({ status: "error", message: "Fill required fields to proceed!" });
            setTimeout(() => setResponse({ status: "", message: "" }), 5000);
            return;
        };

        // SET LOADER
        setResponse({ status: "", message: "" });
        setLoading(true)

        const { countryCode, dialCode, phone, email, fullname, instagram, tiktok, snapchat } = supplierData;
        const socials = { instagram, tiktok, snapchat };
        const contact = { countryCode, dialCode, phone, email, socials };

        // MAKE REQUEST
        try {
            const res = await fetch(`${BASE_API_URL}/suppliers?slug=${store?.slug}`, {
                headers,
                method: "POST",
                body: JSON.stringify({ contact, fullname })
            });

            shouldKick(res);
            const data = await res.json();
            const { status, message } = data;
            if (!status || status != 'success') throw new Error(message);

            // CLEAR FIELDS AND SET RESPONSE MESSAGE
            handleClearFields();
            setResponse({ status, message });
            setTimeout(() => close(), 500);
            handleFetchMyStoreSuppliers()

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
                    <label htmlFor='location' className="form--label">Location (optional)</label>
                    <input type='text' name='location' placeholder='Block 7, Sangotedo Ajah Lagos' className='form--input' value={supplierData.location} onChange={handleSupplierData} />
                </div>

                <div className="form--item" style={{ gap: "1.4rem" }}>
                    <label className="form--label">Contact info (optional)</label>

                    <div className="tabs">
                        <Tab title={<><GiEnvelope /> Email</>} active={selectedInfo.email} onClick={() => handleSelectedInfo("email")} />
                        <Tab title={<><AiFillInstagram />Instagram</>} active={selectedInfo.instagram} onClick={() => handleSelectedInfo("instagram")} />
                        <Tab title={<><AiFillTikTok />Tiktok</>} active={selectedInfo.tiktok} onClick={() => handleSelectedInfo("tiktok")} />
                        <Tab title={<><FaSnapchatSquare />SnapChat</>} active={selectedInfo.snapchat} onClick={() => handleSelectedInfo("snapchat")} />
                    </div>
                    <Info text="Select up to 3 social media platforms (optional, leave empty if none)" />
                    
                    {selectedInfo.email && <LinkInput url={<GiEnvelope />} name="email" value={supplierData.email} handleChange={handleSupplierData} linkPosition='start' placeholder="@ email address" />}
                    {selectedInfo.instagram && <LinkInput url={<AiFillInstagram />} name="instagram" value={supplierData.instagram} handleChange={handleSupplierData} linkPosition='start' placeholder="@ instagram handle" />}
                    {selectedInfo.tiktok && <LinkInput url={<AiFillTikTok />} name="tiktok" value={supplierData.tiktok} handleChange={handleSupplierData} linkPosition='start' placeholder="@ tiktok profile" />}
                    {selectedInfo.snapchat && <LinkInput url={<FaSnapchatSquare />} name="snapchat" value={supplierData.snapchat} handleChange={handleSupplierData} linkPosition='start' placeholder="@ snapchat handle" />}
                    
                </div>

                <div className="page__section--actions">
                    <button className='button clear--button' onClick={handleClearFields} disabled={loading}>Clear Fields</button>
                    <button className={`button ${loading ? "spinner--button" : "submit--button"}`} onClick={handleCreateCustomer} disabled={loading}>{loading ? <Spinner /> : "Submit"}</button>
                </div>
            </div>

        </>
    )
}