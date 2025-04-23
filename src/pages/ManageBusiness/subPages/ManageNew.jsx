import React, { useEffect, useState } from 'react'

import Spinner from '../../../components/spinner/mainSpinner'
import SpinnerTiny from '../../../components/spinner/tiny'
import TooltipUI from '../../../components/layout/TooltipUI';
import Asterisk from '../../../components/elements/Asterisk';
import CustomAlert from '../../../components/layout/CustomAlert';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../context/AuthContext';
import { validateOnboardForm } from '../../../utils/validationHelper';
import { useFetchedContext } from '../../../context/FetchedContext';
import { goalOptions } from '../../../utils/data';
import MainDropdownSelect from '../../../components/form/MainDropdownSelect';
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineDelete } from 'react-icons/ai';
import isOnline from 'is-online';
import logo_demo from '../../../assets/images/dummy_items/demo_quicka_logo.png'
import PhoneInput from 'react-phone-input-2';
import { TiArrowBack } from "react-icons/ti";


const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function ManageNew() {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { handleUser, handleStore, formdataHeader } = useAuthContext();
    const { storeCategories, handleFetchStoreCategories, handleFetchError } = useFetchedContext();

    const [loading, setLoading] = useState(false);
    const [tinyNameLoader, setTinyNameLoader] = useState(false);
    const [tinyUrlLoader, setTinyUrlLoader] = useState(false);

    const [goalsChoosen, setGoalsChoosen] = useState([]);
    const [onboardingErrors, setOnboardingErrors] = useState({});
    const [response, setResponse] = useState({ status: null, message: null });
    const [onboardTabNum, setOnboardTabNum] = useState(1);
    const [logo, setLogo] = useState({ file: "", preview: "" });
    const [selectedCategory, setSelectedCategory] = useState([]);

    const [onboardingData, setOnboardingData] = useState({
        name: "",
        subdomain: "",
        isRegistered: "no",
        regType: "",
    });

    const [phoneData, setPhoneData] = useState({
        phone: '',
        phoneNumber: '',
        dialCode: '',
        countryCode: '',
        country: '',
    })

    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    const handleResetResponse = function () {
        setResponse({ status: "", message: "" });
    }

    const handleOnboardDataChange = function (e, val, opts) {
        if (!e && (val || opts)) {
            const { dialCode, countryCode, name } = opts;
            const phone = val?.startsWith(dialCode + '0') ? val?.replace(dialCode + '0', dialCode) : val;
            const phoneNumber = phone?.replace(dialCode, "");

            setPhoneData({ ...phoneData, phone, phoneNumber, dialCode, countryCode, country: name });
            return;
        }

        const { name, value } = e?.target;
        let sanitizedValue;

        // HERE SANITIZES THE TEXT AND THE URL
        if (name === "name") {
            sanitizedValue = value.replace(/[^a-zA-Z0-9\s]/g, '').replace(/^\s+/, '');
        } else if (name === "subdomain") {
            sanitizedValue = value.replace(/[^a-zA-Z0-9-]/g, '').replace(/^\s+|\s+$/g, '');
        } else {
            sanitizedValue = value;
        }

        setOnboardingData({
            ...onboardingData,
            [name]: sanitizedValue,
        });
    };

    function handleCopyLink() {
        handleResetResponse();
        if (onboardingData.subdomain) {
            const url = onboardingData.subdomain + ".quicka.store";

            navigator.clipboard.writeText(url);
            // setIsCopied(true)
            setResponse({ status: "success", message: "Store URL Copied!" });
            setTimeout(() => handleResetResponse(), 2500);
        }
    }

    const handleImageChange = function (event) {
        const file = event.target.files[0];
        console.log(file)
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setLogo({ file, preview: imageUrl });
        }
    };

    const handleImageRemove = function () {
        setLogo({ file: "", preview: "" })
    }

    // HNADLE GOING TO THE PREVIOUS FORM TAB
    function handlePrevTab() {
        if (onboardTabNum === 1) return;
        setOnboardTabNum(prev => prev - 1)
    }

    // HNADLE GOING TO THE NEXT FORM TAB
    function handleNextTab(e) {
        const formData = { ...onboardingData, selectedCategory, ...phoneData }

        if (onboardTabNum === 1) {
            // DO SOME VALIDATION AND IF ISCOPREATED IS YES, VALIDATE THE CONDITIONAL FIELD
            const newErrors = validateOnboardForm(formData, "manage");
            console.log(newErrors)
            setOnboardingErrors(newErrors);

            if (Object.keys(newErrors).length >= 1) return;
        }
        if (onboardTabNum === 2) {
            if (goalsChoosen.length < 3) {
                return setResponse({ status: "error", message: `Select ${goalsChoosen.length < 1 ? '' : `more than ${goalsChoosen.length}`} at least 3 goal options!` });
            } else if (goalsChoosen.length > 5) {
                return setResponse({ status: "error", message: `Select at most only 5 goal options!` });
            } else {
                return handleSubmitOnboading();
            }
        };
        setOnboardTabNum(prev => prev + 1);
    }

    // HANDLE THE GOALS CHOOSEN
    function handleGoalsChoosen(goal) {
        const isGoalAlreadyIncluded = goalsChoosen.includes(goal);

        if (isGoalAlreadyIncluded) {
            setGoalsChoosen(goalsChoosen.filter((item) => item !== goal));
        } else {
            setGoalsChoosen([...goalsChoosen, goal]);
        }
    }

    useEffect(function () {
        document.title = "Quicka | New Business Onboard";
        if(!user) navigate(-1);
            
        // GET THE STORE CATEGORIES
        handleFetchStoreCategories()
    }, []);


    useEffect(() => {
        window.scrollTo(0, 0);
    }, [onboardTabNum]);


    useEffect(function () {
        handleResetResponse()
    }, [goalsChoosen]);

    useEffect(function () {
        if (onboardingData.isRegistered == "no") {
            setOnboardingData({ ...onboardingData, type: "" })
        }
    }, [onboardingData.isRegistered])


    // SANITIZE THE NAME AS THE LINK, REPLACING SPACES WITH -
    useEffect(function () {
        const sanitizedUrl = onboardingData?.name?.replace(/\s+/g, '-').toLowerCase();
        setOnboardingData({ ...onboardingData, subdomain: sanitizedUrl })
    }, [onboardingData?.name]);


    useEffect(function() {
        const handleSearchName = setTimeout(async function () {
            if (!onboardingData?.name) return;
            setTinyNameLoader(true);

            try {
                const newErrors = {}
                if(onboardingData?.name == "quicka" || onboardingData?.name?.toLowerCase().includes("quicka")) {
                    newErrors.name = "Quicka is a reserved name and connot be used!";
                    setOnboardingErrors({ ...onboardingErrors, ...newErrors });
                    return;
                }

                const res = await fetch(`${import.meta.env.VITE_API_URL}/stores/search-name-url?nameQuery=${onboardingData?.name?.toLowerCase()}`);
                const data = await res.json();
                if(!data?.success && res.status !== 200) throw new Error(data?.message);

                if(data?.data?.results?.name.length > 0) {
                    newErrors.name = "Business name is already taken!";
                }
                setOnboardingErrors(newErrors);
            } catch(err) {
                if (err?.name !== "AbortError") {
                    return err?.message
                }
            } finally {
                setTinyNameLoader(false)
            }
        }, 400)

        return () => clearTimeout(handleSearchName);

    }, [onboardingData?.name])

    useEffect(function() {
        const handleSearchUrl = setTimeout(async function () {
            if (!onboardingData?.subdomain) return;
            setTinyUrlLoader(true);

            try {
                const newErrors = {}
                if(
                    onboardingData?.subdomain == "quicka" || onboardingData?.subdomain.includes("quicka")
                ) {
                    newErrors.subdomain = "Quicka is a reserved name and connot be used!";
                    setOnboardingErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));
                    return;
                }

                const res = await fetch(`${import.meta.env.VITE_API_URL}/stores/search-name-url?urlQuery=${onboardingData?.subdomain}`);
                const data = await res.json();
                if(!data?.success && res.status !== 200) throw new Error(data?.message);

                if(data?.data?.results?.url?.length > 0) {
                    newErrors.subdomain = "Store Url is already taken";
                } else {
                    newErrors.subdomain = ""
                }
                setOnboardingErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));
            } catch(err) {
                if (err?.name !== "AbortError") {
                    return err?.message
                }
            } finally {
                setTinyUrlLoader(false)
            }
        }, 400)

        return () => clearTimeout(handleSearchUrl);

    }, [onboardingData?.subdomain])

    
    async function handleSubmitOnboading() {
        // RESET THE RESPONSE AND LOADING STATE HERE
        setLoading(true);
        handleResetResponse();
        
        try {
            // CHECK CONNECTION
            const connected = await isOnline();
            if (!connected) throw new Error("Internet Error");

            const formData = new FormData();
            formData.append("name", onboardingData.name)
            formData.append("subdomain", onboardingData.subdomain)
            formData.append("isRegistered", onboardingData.isRegistered)
            formData.append("regType", onboardingData.regType)
            formData.append("category", JSON.stringify(selectedCategory[0]))
            formData.append("goalsChoosen", JSON.stringify(goalsChoosen))
            formData.append("phone", phoneData.phone)
            formData.append("phoneNumber", phoneData.phoneNumber)
            formData.append("dialCode", phoneData.dialCode)
            formData.append("countryCode", phoneData.countryCode)
            formData.append("country", phoneData.country)
            if(logo.file) formData.append("image", logo.file);

            // MAKE REQUEST
            const res = await fetch(`${BASE_API_URL}/stores/manage-new`,
                { method: 'POST', body: formData, headers: formdataHeader }
            );

            const data = await res.json();
            if (!data?.status || data?.status !== 'success') {
                throw new Error(data?.message);
            }

            // SET THE ACCESS STORAGE FOR THE CONGRATS PAGE
            setResponse({ status: data?.status, message: data?.message });
            localStorage.setItem(`${import.meta.env.VITE_CONGRATS_KEY}`, "access");

            setTimeout(function () {
                handleUser(data?.data?.auth);
                handleStore(data?.data?.store);

                navigate('/congratulations?next=dashboard');
            }, 2500);
        } catch (err) {
            const message = handleFetchError(err?.message)
            setResponse({ status: "error", message });
        } finally {
            setLoading(false);
        }
    }


    return (
        <React.Fragment>
            {(response.message || response.status) && (
                <CustomAlert type={response.status} message={response.message} />
            )}

            {loading && <Spinner />}

            <section className='onboarding--section'>
                <div className="onboarding--container">

                    <div className="onboarding--top">
                        <p className='onboarding--numbering'>{onboardTabNum}/2 👈🏿</p>
                        <p className='onboarding--subtitle'>
                            Welcome back {user?.firstname}
                            <picture style={{ marginTop: '-1rem' }}>
                                <source srcSet="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.webp" type="image/webp" />
                                <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.gif" alt="🎉" width="24" height="24" />
                            </picture>
                        </p>
                        <h2 className='form--heading' style={{ marginBottom: '1rem', lineHeight: '1.2' }}>
                            {onboardTabNum === 1 && "Let's setup your new business."}
                            {onboardTabNum === 2 && "Choose important goals you need Quicka to achieve."}
                        </h2>
                        <p className='auth--right-text'>
                            {onboardTabNum === 1 && "Tell us a bit about your business so that we can provide you a personalised experienced tailored to your business needs and prefenece."}
                            {onboardTabNum === 2 && `What are the important things you want to use Quicka for. We need this data to create a perfect experience for you.`}
                        </p>
                    </div>

                    <div className="auth--form onboard" style={{ width: '100%' }}>
                        {onboardTabNum === 1 && (
                            <React.Fragment>
                                <form className="form--item">
                                    <label className="form--label" htmlFor='logo'>Business Logo (Optional)</label>

                                    <div className="form--element">
                                        <span><img src={logo.preview || logo_demo} alt="brand logo" /></span>
                                        <div className='form--item'>
                                            <input type='file' id="logo" name="logo" onChange={handleImageChange} accept="image/*" />
                                
                                            <div className="flex" style={{ flexDirection: "row" }}>
                                                <label htmlFor="logo" className='form--upload-btn'>{logo.preview ? "Change" : "Upload Logo"}</label>
                                
                                                {logo.file && (
                                                    <button 
                                                        onClick={handleImageRemove} 
                                                        className='form--upload-btn'
                                                        style={{
                                                            padding: ".45rem .68rem",
                                                            fontSize: "2rem",
                                                            color: "red",
                                                            backgroundColor: "#eee"
                                                        }}
                                                    >
                                                        <AiOutlineDelete />
                                                    </button>
                                                )}
                                            </div>
                                            <p style={{ fontSize: '1.1rem', lineHeight: '1.4' }}>
                                                Recommended size <i className='value'> 256x256</i> <br />PNG, SVG or JPG up to 2MB.
                                            </p>
                                        </div>
                                    </div>
                                </form>

                                <div className="form--item">
                                    <label htmlFor="name" className="form--label">Business Name <Asterisk /></label>
                                    <input type="text" className="form--input" placeholder='Business Name' onChange={handleOnboardDataChange} name="name" id='name' value={onboardingData.name} />
                                    <span className="form--error-message">
                                        {(tinyNameLoader && !onboardingErrors.name) && <SpinnerTiny />}
                                        {onboardingErrors.name && onboardingErrors.name}
                                    </span>
                                </div>

                                <div className="form--grid">
                                    <div className="form--item">
                                        <label htmlFor="subdomain" className="form--label">Store URL</label>
                                        <div className="form--input-box">
                                            <input type="text" id='subdomain' className="form--input" placeholder='Store url' value={onboardingData.subdomain} name='subdomain' onChange={handleOnboardDataChange} />

                                            {(onboardingData.subdomain) ? (
                                                <TooltipUI title="Copy URL" placement="top">
                                                <span style={{ cursor: "copy" }} className='url--box' onClick={handleCopyLink}>.quicka.store</span>
                                            </TooltipUI>
                                            ) : (
                                                <span className='url--box' onClick={handleCopyLink}>.quicka.store</span>
                                            )}
                                        </div>
                                        <span className="form--error-message">
                                            {(tinyUrlLoader && !onboardingErrors.subdomain) && <SpinnerTiny />}
                                            {onboardingErrors.subdomain && onboardingErrors.subdomain}
                                        </span>
                                    </div>
                                    
                                    <div className="form--item">
                                        <label htmlFor="subdomain" className="form--label">Phone Number <Asterisk /></label>

                                        <PhoneInput
                                            country={'ng'}
                                            regions={'africa'}
                                            value={onboardingData.phone}
                                            inputProps={{ name: 'phone', id: 'phone' }}
                                            onChange={(num, countryOpts) => handleOnboardDataChange(null, num, countryOpts)}
                                            inputClass='phone-input'
                                            buttonStyle={{ backgroundColor: 'transparent', border: 'none', paddingLeft: '.4rem', height: '4rem', margin: '.2rem 0' }}
                                            countryCodeEditable={false}
                                            dropdownStyle={{ top: '100%', marginTop: 0, borderRadius: '.4rem', padding: '.2rem' }}
                                        />

                                        <span className="form--error-message">
                                            {onboardingErrors.phone && onboardingErrors.phone}
                                        </span>
                                    </div>
                                    
                                </div>

                                <div className="form--item">
                                    <label htmlFor="type" className="form--label">Is your business incorporated with the Corporate Affairs Commission (CAC)?</label>

                                    <div className="form--clicks">
                                        <div className={`form--click ${onboardingData.isRegistered == "yes" ? 'is-selected' : ''}`}
                                            onClick={() => setOnboardingData({ ...onboardingData, isRegistered: "yes" })}
                                        >Yes <span></span></div>
                                        <div className={`form--click ${onboardingData.isRegistered == "no" ? 'is-selected' : ''}`}
                                            onClick={() => setOnboardingData({ ...onboardingData, isRegistered: "no" })}
                                        >No <span></span></div>
                                    </div>
                                </div>

                                {onboardingData.isRegistered == "yes" && (
                                    <div className="form--item">
                                        <label htmlFor="type" className="form--label">Business registration type <Asterisk /></label>

                                        <select className='form--select' name='regType' id='type' onChange={handleOnboardDataChange} value={onboardingData.regType}>
                                            <option hidden>Select type</option>
                                            <option value="limited-company">Limited Company</option>
                                            <option value="sole-propreitorship">Sole Proprietorship</option>
                                        </select>
                                        <span className="form--error-message">
                                            {onboardingErrors.type && onboardingErrors.type}
                                        </span>
                                    </div>

                                )}

                                <div className="form--item">
                                    <label htmlFor="category" className="form--label">What category best describes your business <Asterisk /></label>

                                    <MainDropdownSelect title="a category" options={storeCategories} field="name" value={selectedCategory} setValue={setSelectedCategory} noDataLabel="No Category Found!" />

                                    <span className="form--error-message">
                                        {onboardingErrors.category && onboardingErrors.category}
                                    </span>
                                </div>
                            </React.Fragment>
                        )}


                        {onboardTabNum === 2 && (
                            <div className="form--item">
                                <p className="form--label" style={{ marginBottom: '1.2rem', opacity: '.65' }}>Choose all that apply: (At least 3, Max 5)</p>
                                <div className="form--click-opts">
                                    {goalOptions.map((goal) => (
                                        <div
                                            key={(goal.id)}
                                            className={`form--click ${goalsChoosen.includes((goal.id)) ? 'is-selected' : ''}`}
                                            onClick={() => handleGoalsChoosen((goal.id))}
                                        >
                                            <p>{goal.label}</p>
                                            <span></span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}


                        <div className="form--item">
                            <span className='onboarding--actions'>
                                {onboardTabNum > 1 ? (
                                    <button className='onboard--prev' onClick={handlePrevTab}>
                                        <AiOutlineArrowLeft /> Previous
                                    </button>
                                ) : (
                                    <button className='onboard--prev' onClick={() => navigate(-1)}>
                                        <TiArrowBack/> Go back
                                    </button>
                                )}

                                <button className='onboard--next'
                                    onClick={handleNextTab}>{onboardTabNum === 2 ? 'Finish' : 'Next Step'}
                                    <AiOutlineArrowRight />
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    )
}
