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
import LinkInput from '../../../components/form/LinkInput';
import Info from '../../../components/elements/Info';


const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function AddCustomer({ close, isModal }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { headers, formdataHeader, store, shouldKick } = useAuthContext();
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

    const [checked, setChecked] = useState(false);
    const [customerImage, setCustomerImage] = useState({ preview: "", file: null });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
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
        description: "",
        address: "",
        zipCode: "",
        instagram: "",
        tiktok: "",
        snapchat: ""
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

    const handleImageChange = function (event) {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setCustomerImage({ preview: imageUrl, file });
        }
    };

    const handleRemoveImage = function() {
        if(id) {
            setShowDeleteModal(true);
        } else {
            setCustomerImage({ preview: "", file: "" });
        }
    }
    
    const handleDeleteImage = async function() {
        // delete image api functionality
        setLoading(true)
        setResponse({ status: "", message: "" });
                
        const connected = await isOnline();
        if(!connected) throw new Error("Internet Error");
        
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/customers/image/${id}`, {
                method: "DELETE", headers
            });
            shouldKick(res)

            const data = await res.json();
            setResponse({ status: "success", message: data?.message });

            setChecked(false);
            setShowDeleteModal(false);
            setCustomerImage({ preview: "", file: "" });
            handleFetchMyStoreCustomers()
        } catch(err) {
            setResponse({ status: "error", message: err?.message })
        } finally {
            setLoading(false)
        }
    }

    const handleSelectedInfo = function(tab) {
        const selected = Object.values(selectedInfo).filter(info => info);
        if (selected.length < 2 && !selectedInfo[tab])
            setSelectedInfo((prev) => ({ ...prev, [tab]: true }));
        if (selected.length > 0 && selectedInfo[tab]) 
            setSelectedInfo((prev) => ({ ...prev, [tab]: false }));
    }

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
        window?.scrollTo({ top: 0, behavior: "smooth" });
        setChecked(false)
        setCustomerImage({ preview: "", file: null });
        setCustomerFormErrors({});
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
                        zipCode: fetchedItem?.shippingAddress?.zipCode || "",
                        instagram: fetchedItem?.socials?.instagram || "",
                        tiktok: fetchedItem?.socials?.tiktok || "",
                        snapchat: fetchedItem?.socials?.snapchat || "",
                    });

                    setSelectedInfo({
                        instagram: fetchedItem?.socials?.instagram ? true : false,
                        tiktok: fetchedItem?.socials?.tiktok ? true : false,
                        snapchat: fetchedItem?.socials?.snapchat ? true : false
                    })
                    setChecked(fetchedItem?.image?.url ? true : false);
                    setCustomerImage({ preview: fetchedItem?.image?.url, file: null });

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


    async function handleSubmit() {
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

        const { countryCode, dialCode, phoneNumber, phone, email, address, zipCode, firstname, lastname, description, instagram, tiktok, snapchat } = customerData;
        const contact = { countryCode, dialCode, phoneNumber, phone, email };
        const shippingAddress = { address, zipCode, country: country[0], state: state[0], city: city[0] }
        const socials = { instagram, tiktok, snapchat };
        

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
            formData.append('socials', JSON.stringify(socials));
            if(customerImage.file) {
                formData.append("image", customerImage.file);
            }

            // MAKE REQUEST
            const res = await fetch(`${BASE_API_URL}/customers${end_point}`, {
                headers: formdataHeader,
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
                pageTitle={`${id ? "Edit" : "Add"} Customer`}
                pageIcon={<FiUsers />}
                close={close} 
                isModal={isModal}
                mainLoader={loading}
                response={response}
                handleClear={handleClearFields}
                handleSubmit={handleSubmit}
                hasExplainer={id ? false : true}
                btnBelow={width < 1000}
            >

                <div className="product__upload--container">
                    {width < 400 && <Line border={1.4} />}

                    <div className='left--container containers'>
                        <div className="card form">
                            <div className="section--heading">
                                <h2>Personal Information</h2>
                                {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                            </div>


                            <div className="form--item">
                                <div className="form--flex" style={{ justifyContent: "flex-start", gap: ".5rem" }}>
                                    <CheckBoxInput isChecked={checked} setIsChecked={setChecked} />
                                    <div onClick={() => setChecked(!checked)}>
                                        <p htmlFor='description' className="form--label">Add Customer Pics (optional)</p>
                                    </div>
                                </div>

                                {checked && (
                                    <ProfileImageUploader
                                        preview={customerImage.preview}
                                        handleChange={handleImageChange}
                                        handleRemove={handleRemoveImage}
                                    />
                                )}
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

                            <div className="form--item form--socials" style={{ gap: "1.4rem" }}>
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

                        </div>
                    </div>

                    {width < 400 && <Line border={1.4} />}

                    <div className='right--container containers'>
                        <div className="card form">
                            <div className="section--heading">
                                <h2>Delivery Details</h2>
                                {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                            </div>

                            <div className="form--item">
                                <label htmlFor='address' className="form--label">Location (optional)</label>
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
        </React.Fragment>
    )
}