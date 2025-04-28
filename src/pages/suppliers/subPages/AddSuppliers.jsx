import React, { useState, useEffect } from 'react'
import { useDataContext } from '../../../context/DataContext';
import MainDropdownSelect from '../../../components/form/MainDropdownSelect';
import { FiUsers } from 'react-icons/fi';
import { useWindowSize } from 'react-use';
import Line from '../../../components/elements/Line';
import Asterisk from '../../../components/elements/Asterisk';
import PhoneInput from 'react-phone-input-2';
import { validateCustomerForm } from '../../../utils/validationHelper';
import { useAuthContext } from '../../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetchedContext } from '../../../context/FetchedContext';
import AddPageUI from '../../../ui/PageUI/AddPageUI';
import isOnline from 'is-online';
import CheckBoxInput from '../../../components/form/CheckBoxInput';
import ProfileImageUploader from '../../../components/form/ProfileImageUploader';
import Delete from '../../../components/modal/Delete';
import { AiFillInstagram, AiFillTikTok } from 'react-icons/ai';
import { FaSnapchatSquare } from 'react-icons/fa';
import Tab from '../../../components/elements/Tab';
import { RiMapPinUserLine } from 'react-icons/ri';
import { GiEnvelope } from 'react-icons/gi';
import Info from '../../../components/elements/Info';


const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function AddSuppliers() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { headers, store, shouldKick } = useAuthContext();
    const { handleFetchMyStoreCustomers, handleFetchError, handleFetchOneItem } = useFetchedContext();

    const { countryCode } = store?.contact;

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({
        status: null,
        message: null
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedInfo, setSelectedInfo] = useState({ email: false, instagram: false, tiktok: false, snapchat: false });

    const [customerFormErrors, setSupplierFormErrors] = useState({});
    const [supplierData, setSupplierData] = useState({
        fullname: "",
        phone: "",
        phoneNumber: "",
        dialCode: "",
        countryCode: "",
        description: "",
        address: "",
        zipCode: ""
    });


    const handleSupplierData = function (e, val, opts) {
        if (!e && (val || opts)) {
            const { dialCode, countryCode } = opts;
            const phone = val?.startsWith(dialCode + '0') ? val?.replace(dialCode + '0', dialCode) : val;
            const phoneNumber = phone?.replace(dialCode, "");

            setSupplierData({ ...supplierData, phone: phone, phoneNumber, dialCode, countryCode });
            return;
        }

        const { name, value } = e?.target;
        setSupplierData({
            ...supplierData,
            [name]: value,
        });
    };
    
    const handleSelectedInfo = function(tab) {
        const selected = Object.values(selectedInfo).filter(info => info);
        if (selected.length < 3 && !selectedInfo[tab])
            setSelectedInfo((prev) => ({ ...prev, [tab]: true }));
        if (selected.length > 0 && selectedInfo[tab]) 
            setSelectedInfo((prev) => ({ ...prev, [tab]: false }));
    }

    const handleClearFields = function() {
        setSupplierData({
            fullname: "",
            phone: "",
            dialCode: "",
            countryCode: "",
            description: "",
            location: "",
        });

        window?.scrollTo({ top: 0, behavior: "smooth" });
        setSupplierFormErrors({});
    }

    useEffect(function() {
        document.title = "Quicka | Add Suppliers"
    }, [])

    
    // fetching the item if id is given
    useEffect(function() {
        (async () => {
            if(id) {
                setLoading(true);
                const fetchedItem = await handleFetchOneItem("customer", id);
                setLoading(false);

                if(fetchedItem) {
                    setSupplierData({
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
                }
            }
        })();

    }, [id]);


    async function handleSubmit() {
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
        setLoading(true);

        const { countryCode, dialCode, phoneNumber, phone, email, address, zipCode, firstname, lastname, description } = supplierData;
        const contact = { countryCode, dialCode, phoneNumber, phone, email };
        const shippingAddress = { address, zipCode, country: country[0], state: state[0], city: city[0] }
        
        const end_point = id ? `/${id}` : `?slug=${store?.slug}`

        try {
            // CHECK CONNECTION
            const connected = await isOnline();
            if(!connected) throw new Error("Internet Error");

            const formData = new FormData();
            formData.append('firstname', firstname);
            formData.append('lastname', lastname);
            formData.append('description', description);
            formData.append('contact', JSON.stringify(contact));
            formData.append('shippingAddress', JSON.stringify(shippingAddress));
            if(customerImage.file) {
                formData.append("image", customerImage.file);
            }

            // MAKE REQUEST
            const res = await fetch(`${BASE_API_URL}/customers${end_point}`, {
                headers,
                method: id ? "PATCH" : "POST",
                body: formData
            });
            shouldKick(res);

            const data = await res.json();
            const { status, message } = data;
            if (!status || status != 'success') throw new Error(message);

            // SET RESPONSE MESSAGE
            handleClearFields();
            setResponse({ status, message });
            
            setTimeout(() => navigate(-1), 1000);
            handleFetchMyStoreCustomers()

        } catch (err) {
            const message = handleFetchError(err?.message)
            setResponse({ status: "error", message });
        } finally {
            setLoading(false)
        }
    }


    return (
        <React.Fragment>
            {showDeleteModal && <Delete close={() => setShowDeleteModal(false)} fn={handleDeleteImage} text="This image will be deleted!" />}

            <AddPageUI
                pageTitle={`${id ? "Edit" : "Add"} Supplier`}
                pageIcon={<RiMapPinUserLine />}
                close={() => navigate(-1)} 
                mainLoader={loading}
                response={response}
                handleClear={handleClearFields}
                handleSubmit={handleSubmit}
                hasExplainer={false}
                btnBelow={false}
            >

                <div className="product__upload--container">
                    {width < 400 && <Line border={1.4} />}

                    <div className='left--container containers'>
                        <div className="card form">
                            <div className="section--heading">
                                <h2>Personal Information</h2>
                                {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                            </div>

                            <div className="form--grid">
                                <div className="form--item">
                                    <label htmlFor="fullname" className="form--label">Fullname <Asterisk /></label>
                                    <input type="text" id="fullname" name='fullname' className="form--input" placeholder='Matthew Jude' value={supplierData.fullname} onChange={handleSupplierData} />
                                    <span className="form--error-message">
                                        {customerFormErrors?.fullname && customerFormErrors?.fullname}
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
                                        {customerFormErrors?.phone && customerFormErrors?.phone}
                                    </span>
                                </div>
                            </div>

                            <div className="form--item" style={{ gap: "1.4rem" }}>
                                <label className="form--label">Socials (optional)</label>
                                <div className="tabs" style={{ justifyContent: "flex-start" }}>
                                    <Tab title={<><GiEnvelope /> Email</>} active={selectedInfo.email} onClick={() => handleSelectedInfo("email")} />
                                    <Tab title={<><AiFillInstagram />Instagram</>} active={selectedInfo.instagram} onClick={() => handleSelectedInfo("instagram")} />
                                    <Tab title={<><AiFillTikTok />Tiktok</>} active={selectedInfo.tiktok} onClick={() => handleSelectedInfo("tiktok")} />
                                    <Tab title={<><FaSnapchatSquare />SnapChat</>} active={selectedInfo.snapchat} onClick={() => handleSelectedInfo("snapchat")} />
                                </div>
                                
                                <Info text="Select at most three (3) contact info or leave empty" />
                    
                                {selectedInfo.email && <input type='text' name='email' placeholder='Enter email' className='form--input' value={supplierData.country} onChange={handleSupplierData} />}
                                {selectedInfo.instagram && <input type='text' name='instagram' placeholder='@quickabusiness' className='form--input' value={supplierData.countryCode} onChange={handleSupplierData} />}
                                {selectedInfo.tiktok && <input type='text' name='country' placeholder='@' className='form--input' value={supplierData.countryCode} onChange={handleSupplierData} />}
                                {selectedInfo.snapchat && <input type='text' name='country' placeholder='Enter Country' className='form--input' value={supplierData.countryCode} onChange={handleSupplierData} />}
                            </div>
                        </div>
                    </div>

                    {width < 400 && <Line border={1.4} />}

                    <div className='right--container containers'>
                       <div className="card form">
                        <div className="section--heading">
                                <h2>Other Details</h2>
                                {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                            </div>

                            <div className="form--item">
                                <label htmlFor='address' className="form--label">Location (optional)</label>
                                <textarea id='address' name='address' className="form--input" placeholder='Block 12, Flat 3, Libra Estate, Lagos State Nigeria' value={supplierData.address} onChange={handleSupplierData} />
                            </div>

                            <div className="form--item">
                                <label htmlFor='address' className="form--label">Additional Description (optional)</label>
                                <textarea id='address' name='address' className="form--input" placeholder='description' value={supplierData.address} onChange={handleSupplierData} />
                            </div>
                       </div>
                    </div>
                </div>
            </AddPageUI>
        </React.Fragment>
    )
}