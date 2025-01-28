import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../../../context/AuthContext'
import { useNavigate } from 'react-router-dom';
import AddPageUI from '../../../ui/PageUI/AddPageUI';
import { MdOutlineStorefront } from 'react-icons/md';
import Line from '../../../components/elements/Line';
import Asterisk from '../../../components/elements/Asterisk';
import { useWindowSize } from 'react-use';
import SpinnerTiny from "../../../components/spinner/tiny"
import LogoUploadInput from '../../../components/form/LogoUploadInput';
import Info from '../../../components/elements/Info';
import MainDropdownSelect from '../../../components/form/MainDropdownSelect';
import { useFetchedContext } from '../../../context/FetchedContext';
import { useDataContext } from '../../../context/DataContext';
import PhoneInput from 'react-phone-input-2';
import isOnline from 'is-online';
import { cap1stLetter } from '../../../utils/helper';
import { validateStoreDeatilsForm } from '../../../utils/validationHelper';


function EditDetails() {
    const navigate = useNavigate()
    const { width } = useWindowSize()
    const { store, formdataHeader, shouldKick, handleStore } = useAuthContext();
    const { location, getStates, getCities, setLocation } = useDataContext();
    const { storeCategories, handleFetchStoreCategories, handleFetchError } = useFetchedContext();

    const { paymentCurrencies, paymentMainCurrency, contact } = store;
    const { countryCode } = store?.contact;
    // const currency = store?.currency?.symbol;

    const [country, setCountry] = useState([]);
    const [state, setState] = useState([]);
    const [city, setCity] = useState([]);

    const [storeData, setStoreData] = useState({
        name: store?.name ? store?.name : "",
        slogan: store?.slogan ? store?.slogan : "",
        description: store?.description ? store?.description : "",
        subdomain: store?.subdomain ? store?.subdomain : "",
        category: store?.category?.name ? [store?.category] : [],
        countryCode: countryCode ? countryCode : "",
        dialCode: contact?.dialCode ? contact?.dialCode : "",
        phoneNumber: contact?.phoneNumber ? contact?.phoneNumber : "",
        phone: contact?.phone ? contact?.phone : "",
        paymentMainCurrency: paymentMainCurrency ? paymentMainCurrency : 0,
        address: store?.location?.address ? store?.location?.address : "",
        zip: store?.location?.zip ? store?.location?.zip : "",
    })

    const [loading, setLoading] = useState({ mainLoader: false, tiny: false });
    const [response, setResponse] = useState({ status: "", message: "" });
    const [logo, setLogo] = useState({ file: "", preview: "" });
    const [storeDataErrors, setStoreDataErrors] = useState({});


    const handleResetResponse = function () {
        setResponse({ status: "", message: "" });
    }

    const handleImageChange = function (event) {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setLogo({ file, preview: imageUrl });
        }
    };

    const handleImageRemove = function () {
        console.log(logo.preview)
        setLogo({ file: "", preview: "" })
    }

    const handleStoreDataChange = function (e, val, opts) {
        if (!e && (val || opts)) {
            const { dialCode, countryCode } = opts;
            const phone = val?.startsWith(dialCode + '0') ? val?.replace(dialCode + '0', dialCode) : val;
            const phoneNumber = phone?.replace(dialCode, "");

            setStoreData({ ...storeData, phone: phone, phoneNumber, dialCode, countryCode });
            return;
        }

        const { name, value } = e?.target;
        let sanitizedValue;

        // HERE SANITIZES THE TEXT AND THE URL
        if (name === "name") {
            sanitizedValue = value.replace(/[^a-zA-Z0-9\s]/g, '').replace(/^\s+/, '');
        } else {
            sanitizedValue = value;
        }

        setStoreData({
            ...storeData,
            [name]: sanitizedValue,
        });
    };


    const handleReset = function() {
        setStoreData({
            name: store?.name ? store?.name : "",
            slogan: store?.slogan ? store?.slogan : "",
            description: store?.description ? store?.description : "",
            subdomain: store?.subdomain ? store?.subdomain : "",
            category: store?.category?.name ? [store?.category] : [],
            countryCode: countryCode ? countryCode : "",
            dialCode: contact?.dialCode ? contact?.dialCode : "",
            phoneNumber: contact?.phoneNumber ? contact?.phoneNumber : "",
            phone: contact?.phone ? contact?.phone : "",
            paymentMainCurrency: paymentMainCurrency ? paymentMainCurrency : 0,
            address: store?.location?.address ? store?.location?.address : "",
            zip: store?.location?.zip ? store?.location?.zip : "",
        })
        setCountry(store?.location?.country?.name ? [store?.location?.country] : []);
        setState(store?.location?.state?.name ? [store?.location?.state] : []);
        setCity(store?.location?.city?.name ? [store?.location?.city] : []);
    }

    useEffect(function() {
        document.title = `Quicka | Edit ${cap1stLetter(store?.name)}'s Store Details`
        
        setLoading({ ...loading, mainLoader: true });
        handleFetchStoreCategories();
        setCountry(store?.location?.country?.name ? [store?.location?.country] : []);
        setState(store?.location?.state?.name ? [store?.location?.state] : []);
        setCity(store?.location?.city?.name ? [store?.location?.city] : []);

        setTimeout(() => {
            setLoading({ ...loading, mainLoader: false });
        }, 1000);
    }, []);

    useEffect(function () {
        const sanitizedUrl = storeData?.name?.replace(/\s+/g, '-').toLowerCase();
        setStoreData({ ...storeData, subdomain: sanitizedUrl })
    }, [storeData?.name]);


    // FETCHING STATES OF COUNTRIES
    useEffect(function () {
        if (country.length > 0) {
            getStates(country[0]?.iso2)
        }
    }, [country[0]]);

    // FETCHING CITIES OF STATES OF COUNTRIES
    useEffect(function () {
        setLocation({ ...location, city: [] });

        if (country.length > 0 && state.length > 0) {
            getCities(country[0]?.iso2, state[0]?.iso2);
        }
    }, [country[0], state[0]]);


    // CHECK IF THE STORE NAME AND URL HASN'T ALREADY BEEN USED
    useEffect(function() {
        const handleSearchNameAndUrl = setTimeout(async function () {
            if (!storeData?.name && !storeData?.subdomain) return;
            if(storeData.name == store?.name && storeData.subdomain == store?.subdomain) return;

            setLoading({ ...loading, tiny: true });

            try {

                const newErrors = {}
                if(storeData?.name == "quicka" || storeData?.name?.toLowerCase().includes("quicka")) {
                    newErrors.name = "Quicka is a reserved name and connot be used!";
                    setStoreDataErrors({ ...storeDataErrors, ...newErrors });
                    return;
                }

                const res = await fetch(`${import.meta.env.VITE_API_URL}/stores/search-name-url?nameQuery=${storeData?.name?.toLowerCase()}&urlQuery=${storeData?.subdomain}&id=${store?._id}`);
                const data = await res.json();
                if(!data?.success && res.status !== 200) throw new Error(data?.message);

                const { results } = data?.data;
                if(results?.name.length > 0 || results?.url.length > 0) newErrors.name = "Business name or store url is already taken!";
                else newErrors.name = ""
                setStoreDataErrors({...storeDataErrors, ...newErrors});
            } catch(err) {
                if (err?.name !== "AbortError") return err?.message
            } finally {
                setLoading({ ...loading, tiny: false });
            }
        }, 400)

        return () => clearTimeout(handleSearchNameAndUrl);
    }, [storeData?.name])


    async function handleSubmit() {
        // const newErrors = validateStoreDeatilsForm(storeData);
        // console.log(newErrors)
        // setStoreDataErrors(newErrors);
        // if (Object.keys(newErrors)?.length >= 1) {
        //     setResponse({ status: "error", message: "Fill required fields to proceed!" });
        //     setTimeout(() => setResponse({ status: "", message: "" }), 5000);
        //     return;
        // };

        // RESET THE RESPONSE AND LOADING STATE HERE
        setLoading({ ...loading, mainLoader: true });
        handleResetResponse();

        const contact = {
            countryCode: storeData.countryCode,
            dialCode: storeData.dialCode,
            phoneNumber: storeData.phoneNumber,
            phone: storeData.phone,
            email: store?.contact?.email
        }
        
        const location = {
            address: storeData?.address,
            zip: storeData?.zip,
            ...(state[0]?.name && { state: state[0] }),
            ...(city[0]?.name && { city: city[0] }),
            country: country[0],
        }

        const category = {
            name: storeData.category[0]?.name,
            slug: storeData.category[0]?.slug,
        }
            
        try {
            // CHECK CONNECTION
            const connected = await isOnline();
            if (!connected) throw new Error("Internet Error");

            const formData = new FormData();
            formData.append("name", storeData.name)
            formData.append("category", JSON.stringify(category))
            formData.append("slogan", storeData.slogan);
            formData.append("description", storeData.description);
            formData.append("paymentMainCurrency", storeData.paymentMainCurrency);
            formData.append("contact", JSON.stringify(contact));
            formData.append("location", JSON.stringify(location));
            if(logo.file) formData.append("image", logo.file)

            if(storeData.subdomain !== store?.subdomain) {
                formData.append("subdomain", storeData.subdomain)
            }

            // MAKE REQUEST
            const res = await fetch(`${import.meta.env.VITE_API_URL}/stores/edit-details`,
                { method: 'PATCH', body: formData, headers: formdataHeader }
            );
            shouldKick(res)

            const data = await res.json();
            if (!data?.status || data?.status !== 'success') {
                throw new Error(data?.message);
            }

            // SET THE ACCESS STORAGE FOR THE CONGRATS PAGE
            setResponse({ status: data?.status, message: data?.message });
            handleStore(data?.data?.store);

            setTimeout(function () {
                navigate(-1)
            }, 2000);
            
        } catch (err) {
            const message = handleFetchError(err?.message)
            setResponse({ status: "error", message });
        } finally {
            setLoading({ ...loading, mainLoader: false});
        }
    }

    return (
        <AddPageUI
            pageTitle={`Edit store details`}
            pageIcon={<MdOutlineStorefront />}
            close={() => navigate(-1)}
            mainLoader={loading.mainLoader}
            response={response}
            handleClear={handleReset}
            handleSubmit={handleSubmit}
        >

            <div className="product__upload--container">
                {width < 400 && <Line border={1.4} />}

                <div className='left--container containers'>
                    <div className="card form">
                        <div className="section--heading">
                            <h2>Store Main Information</h2>
                            {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                        </div>

                        <div className="form--item details" style={{ marginBottom: "3rem" }}>
                            <label className="form--label" htmlFor='logo'>Business Logo (Optional)</label>
                            
                            <LogoUploadInput
                                logoPreview={logo.preview}
                                handleLogoChange={handleImageChange}
                                handleLogoRemove={handleImageRemove}
                            />
                        </div>

                        <div className="form--item">
                            <label htmlFor="name" className="form--label">Business Name <Asterisk /></label>
                            <Info text="Note that store url would change as well" />
                            <input type="text" className="form--input" placeholder='Business Name' onChange={handleStoreDataChange} name="name" id='name' value={storeData.name} />

                            <span className="form--error-message">
                                {(loading.tiny && !storeDataErrors.name) && <SpinnerTiny />}
                                {storeDataErrors.name && storeDataErrors.name}
                            </span>
                        </div>

                        <div className="form--item">
                            <label htmlFor="subdomain" className="form--label">Store URL</label>
                            <div className="form--input-box">
                                <input type="text" id='subdomain' className="form--input" placeholder='Store url' value={storeData.subdomain} name='subdomain' onChange={handleStoreDataChange} disabled />

                                <span className='url--box'>.quicka.store</span>
                            </div>
                        </div>

                        <div className="form--item">
                            <label htmlFor="slogan" className="form--label">Business Slogan</label>
                            <input type="text" id="slogan" name='slogan' className="form--input" placeholder='Slogan: Meeting your every needs..' value={storeData.slogan} onChange={handleStoreDataChange} />
                        </div>

                        <div className="form--item">
                            <label htmlFor="firstname" className="form--label">Business Category <Asterisk /></label>

                            <MainDropdownSelect title="a category" options={storeCategories} field="name" value={storeData.category} setValue={(value) => setStoreData({ ...storeData, category: value })} noDataLabel="Categories Loading..." />

                            <span className="form--error-message">
                                {storeDataErrors?.category && storeDataErrors?.category}
                            </span>
                        </div>

                        <div className="form--item">
                            <label htmlFor="description" className="form--label">Business Description</label>
                            <textarea name="description" id="description" className="form--input" placeholder='Description..' value={storeData.description} onChange={handleStoreDataChange} />
                        </div>
                    </div>
                </div>


                <div className='right--container containers'>
                    <div className="card form">
                        <div className="section--heading">
                            <h2>Store Data & Location</h2>
                            {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                        </div>

                        <div className="form--item">
                            <label htmlFor="email" className="form--label">Email Address</label>
                            <input type="email" id="email" name='email' className="form--input" value={store?.contact?.email} onChange={() => {}} disabled />
                        </div>

                        <div className="form--item">
                            <label htmlFor="phone" className="form--label">Phone Number <Asterisk /></label>

                            <PhoneInput
                                country={countryCode}
                                onlyCountries={[countryCode]}
                                value={storeData.phone}
                                inputProps={{ name: 'phone', id: 'phone' }}
                                onChange={(num, countryOpts) => handleStoreDataChange(null, num, countryOpts)}
                                inputClass='phone-input'
                                buttonStyle={{ backgroundColor: 'transparent', border: 'none', paddingLeft: '.4rem', height: '4rem', margin: '.2rem 0' }}
                                countryCodeEditable={false}
                                dropdownStyle={{ top: '100%', marginTop: 0, borderRadius: '.4rem', padding: '.2rem' }}
                            />
                            <span className="form--error-message">
                                {storeDataErrors?.phone && storeDataErrors?.phone}
                            </span>
                        </div>

                        <div className="form--item">
                            <label className="form--label">Currency</label>

                            <MainDropdownSelect title="Main Currency" options={paymentCurrencies} field="name" value={[paymentCurrencies[paymentMainCurrency]]} setValue={(value) => setStoreData({ ...storeData, paymentMainCurrency: paymentCurrencies?.findIndex(el => el.name === value[0].name) })} clearable={false} />
                        </div>

                        <div className="form--item">
                            <label htmlFor='address' className="form--label">Physical Address</label>
                            
                            <textarea id='address' name='address' className="form--input" placeholder='Block 12, Flat 3, Libra Estate, Lagos State Nigeria' value={storeData.address} onChange={handleStoreDataChange} />
                        </div>
                            
                        <div className="form--grid">
                            <div className="form--item">
                                <label className="form--label">Country</label>

                                <MainDropdownSelect title="a Country" field="name" value={country} setValue={setCountry} customClass='select-width' noDataLabel={store?.location?.country?.name ? "Country cannot be changed" : "Loading..."} clearable={store?.location?.country?.name ? false : true} />
                            </div>

                            <div className="form--item">
                                <label className="form--label">State</label>

                                <MainDropdownSelect title="a state" options={location?.state} field="name" value={state} setValue={setState}customClass='select-width' noDataLabel="Choose country, Loading..." />
                            </div>

                            <div className="form--item">
                                <label className="form--label">City</label>

                                <MainDropdownSelect title="a city" options={location?.city} field="name" value={city} setValue={setCity} customClass='select-width' noDataLabel='Choose state, Loading...' />
                            </div>

                            <div className="form--item">
                                <label htmlFor='zip' className="form--label">Zip Code</label>

                                <input type='number' id='zip' name='zipCode' placeholder='Enter zip code' className='form--input' value={storeData.zipCode} onChange={handleStoreDataChange} />
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </AddPageUI>
    )
}

export default EditDetails