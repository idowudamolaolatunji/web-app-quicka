import React, { useEffect, useState } from 'react'
import { MdOutlineStorefront } from 'react-icons/md';
import { useWindowSize } from 'react-use'
import BackButton from '../button/BackButton';
import Line from '../elements/Line';

import ImageUploadInput from '../form/ImageUploadInput';
import { useAuthContext } from '../../context/AuthContext';
import { AiFillFacebook, AiFillInstagram, AiFillTikTok, AiFillTwitterSquare, AiFillX, AiOutlineLink, AiOutlineWhatsApp } from 'react-icons/ai';
import ColorBox from '../elements/ColorBox';

import LinkInput from '../form/LinkInput';
import { Switch } from '@mui/material';
import QuillEditor from '../form/QuillEditor';
import Template1 from "../../ui/templateUI/Template1";
import Info from '../elements/Info';
import { colors } from '../../utils/data';
import Asterisk from '../elements/Asterisk';
import Confetti from '../layout/Confetti';
import { useNavigate } from 'react-router-dom';
import CustomAlert from '../layout/CustomAlert';
import Spinner from '../spinner/mainSpinner';
import { createPortal } from 'react-dom';
import { useFetchedContext } from '../../context/FetchedContext';
import LogoUploadInput from '../form/LogoUploadInput';
import FaviconInput from '../form/FaviconInput';
import demo_logo from '../../assets/images/dummy_items/dummy_logo.png'
import { useCheckInternetConnection } from '../../hooks/useCheckInternetConnection';
import ColorPicker from 'rsuite-color-picker';

const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function StoreCustom({ isnew, close }) {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { store, shouldKick, handleStore, formdataHeader } = useAuthContext();
    const { handleFetchError } = useFetchedContext();
    const internetStatus = useCheckInternetConnection();

    const { contact, otherPages, socialProfiles, bannerHeading, bannerSubHeading, headline, brandColor } = store;
    const width450False = width < 450 ? false : true;

    const [loading, setLoading] = useState({ mainLoading: false, imageLoading: false });
    const [response, setResponse] = useState({ status: "", message: "" });
    const [showConfetti, setShowConfetti] = useState(false);

    const [storeLogo, setStoreLogo] = useState({ preview: "", file: null });
    const [banner, setBanner] = useState({ preview: "", file: null });
    const [favicon, setFavicon] = useState({ preview: "", file: null });

    const [selectedColor, setSelectedColor] = useState("");
    const [customColor, setCustomColor] = useState({ color: "", isValid: false });

    const [storeData, setStoreData] = useState({
        headline: "",
        bannerHeading: "",
        bannerSubHeading: "",
        brandColor: "",

        aboutPage: width450False,
        returnPolicyPage: width450False,
        aboutDescription: "",
        returnPolicyDescription: "",

        instagram: "",
        whatsapp: "",
        facebook: "",
        twitter: "",
        tiktok: "",
    });


    const handleImageChange = function (event) {
        const name = event.target.name;
        const file = event.target.files[0];

        if (file) {
            const imageUrl = URL.createObjectURL(file);
            if (name == "storeLogo") {
                setStoreLogo({ preview: imageUrl, file });
            }

            if (name == "banner") {
                setBanner({ preview: imageUrl, file });
            }
            
            if (name == "favicon") {
                setFavicon({ preview: imageUrl, file });
            }
        }
    };

    const handleRemoveImage = function (name) {
        if (name == "storeLogo") {
            setStoreLogo({ preview: "", file: "" });
        }

        if (name == "banner") {
            setBanner({ preview: "", file: "" });
        }

        if (name == "favicon") {
            setFavicon({ preview: imageUrl, file });
        }
    }

    function handleSelectColor(color) {
        setSelectedColor(color);
        if (customColor.color) {
            setCustomColor({ color: "", isValid: false });
        }
    }

    const handleStoreClicks = function (name) {
        setStoreData({ ...storeData, [name]: !storeData[name] })
    }

    const handleStoreDescriptions = function (name, value) {
        setStoreData({ ...storeData, [name]: value });
    }

    const handleStoreDataChange = function (e) {
        const { name, value } = e?.target;
        let modified;

        if (name == "tiktok") {
            modified = value?.replace(/^@?/, '@')?.replace(/\s+/g, '');
        } else {
            modified = value
        }

        setStoreData({ ...storeData, [name]: modified });
    };

    function handleCustomColor(e) {
        console.log(e)
        const color = e.target.value
        setCustomColor({ ...customColor, color });
    }

    const handleLoading = function (key, value) {
        setLoading({
            ...loading, [key]: value,
        });
    }

    const handleResetResponse = function () {
        setResponse({ status: null, message: null });
    }

    // SET COLORS BUT CHECK IF COLOR IS VALID FIRST
    useEffect(function () {
        const color = customColor.color;
        const check = new Option().style;
        check.color = color;

        if (check.color.length > 0) {
            setCustomColor({ ...customColor, isValid: true });
            setSelectedColor("");
        } else {
            setCustomColor({ ...customColor, isValid: false });
        }
    }, [customColor.color]);

    // SET THE BRAND COLOR
    useEffect(function () {
        if ((customColor.color && customColor.isValid) || selectedColor) {
            setStoreData({ ...storeData, brandColor: (customColor.color || selectedColor) });
        } else {
            setStoreData({ ...storeData, brandColor: "" });
        }
    }, [customColor, selectedColor]);

    useEffect(function () {
        !isnew && window.scrollTo(0, 0);
    }, []);

    useEffect(function () {
        setStoreData({
            bannerHeading: bannerHeading || "",
            bannerSubHeading: bannerSubHeading || "",
            headline: headline || "",
            brandColor: brandColor || "",
    
            aboutPage: otherPages?.aboutPage || width450False,
            returnPolicyPage: otherPages?.returnPolicyPage || width450False,
            aboutDescription: otherPages?.aboutDescription || "",
            returnPolicyDescription: otherPages?.returnPolicyDescription || "",
    
            instagram: socialProfiles?.instagram || "",
            whatsapp: contact?.phone || "",
            facebook: socialProfiles?.facebook || "",
            twitter: socialProfiles?.twitter || "",
            tiktok: socialProfiles?.tiktok || "",
        });

        setCustomColor({ 
            color: brandColor || "", 
            isValid: brandColor ? true : false
        });
        setStoreLogo({
            preview: store?.storeLogo?.url ?? "",
            file: null
        });
        setBanner({ 
            preview: store?.banner?.url || "",
            file: null
        })
        setFavicon({
            preview: store?.favicon?.url || "",
            file: null
        });
    }, [store]);


    async function handleSubmitCustomStore() {
        handleResetResponse()
        handleLoading("mainLoading", true);

        const {
            instagram, whatsapp, facebook, twitter,
            headline, bannerHeading, bannerSubHeading, brandColor,
            aboutDescription, returnPolicyDescription
        } = storeData;
        const socialProfiles = { instagram, whatsapp, facebook, twitter };
        const otherPages = {
            aboutDescription, returnPolicyDescription,
            aboutPage: aboutDescription ? true : false,
            returnPolicyPage: returnPolicyDescription ? true : false,
        }

        const formData = new FormData();
        formData.append("bannerHeading", bannerHeading);
        formData.append("bannerSubHeading", bannerSubHeading);
        formData.append("headline", headline);
        formData.append("brandColor", brandColor);
        formData.append("socialProfiles", JSON.stringify(socialProfiles));
        formData.append("otherPages", JSON.stringify(otherPages));

        if(storeLogo.file && isnew) {
            formData.append("logo", storeLogo.file);
        }

        if(banner.file) {
            formData.append("banner", banner.file);
        }

        if(!isnew && favicon.file) {
            formData.append("favicon", favicon.file);
        }

        try {
            // CHECK CONNECTION
            if(internetStatus == "offline") throw new Error("Internet Error");

            const parameter = isnew ? "onboard/customize" : "customize/template"
            // MAKE REQUEST
            const res = await fetch(`${BASE_API_URL}/stores/${parameter}?slug=${store?.slug}`, {
                method: "PATCH",
                headers: formdataHeader,
                body: formData
            });
            shouldKick(res)

            const data = await res.json();
            if (data?.status != "success") throw new Error(data?.message);
            isnew && setShowConfetti(true);

            // SET RESPONSE MESSAGE and MODIFY STORE IN THE COOKIE
            setResponse({ status: "success", message: data?.message });
            handleStore(data?.data?.store);

            setTimeout(function () {
                if (isnew) close();
                else navigate(-1)
            }, isnew ? 2500 : 1500);

        } catch (err) {
            const message = handleFetchError(err?.message)
            setResponse({ status: "error", message });
        } finally {
            handleLoading("mainLoading", false);
        }
    }

    
    return (
        <React.Fragment>
            {showConfetti && <Confetti customHeight={2500} customGv={0.1} />}
            {loading.mainLoading && createPortal(<Spinner />, document.body)}
            {(response.message || response.status) && (
                createPortal(<CustomAlert type={response.status} message={response.message} />, document.body)
            )}

            <section className="product__upload-section" style={!isnew ? { maxWidth: "105rem", margin: "0 auto" } : {}}>
                <div className="page__section--heading">
                    <span className="flex justify">
                        <BackButton close={close} />
                        <h2 className="page__section--title">Customize {isnew ? "Your Store" : "Store View"}<MdOutlineStorefront /></h2>
                    </span>
                </div>

                <form className="product__upload--container custom" onSubmit={e => e.preventDefault()}>

                    {isnew && (
                        <>
                            {width < 600 && <Line border={1.4} />}

                            <div className="custom--head">
                                <LogoUploadInput
                                    name="storeLogo"
                                    logoPreview={storeLogo.preview}
                                    hasFile={storeLogo.file && true}
                                    handleLogoChange={handleImageChange}
                                    handleLogoRemove={() => handleRemoveImage("storeLogo")}
                                />

                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span className="custom--labels" style={{ gap: ".6rem" }}>
                                        <h3 className="custom--title">{store?.name}</h3>

                                        <a className="custom--link" target="_blank" href={`https://${store?.storeUrl}`} >
                                            https://{store?.storeUrl} <AiOutlineLink />
                                        </a>
                                    </span>

                                    {width > 500 && (
                                        <div className="page__section--actions">
                                            <button className='button clear--button' onClick={close}>Cancel</button>
                                            <button className='button submit--button' onClick={handleSubmitCustomStore}>Save</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    <Line border={1.4} />

                    <div className="custom--item" style={width < 800 ? { gridTemplateColumns: "1fr", gap: "2rem" } : {}}>
                        <span className="custom--labels">
                            <label className='form--label'>Store Banner (optional)</label>
                            <p className="custom--subtext">This is the image on the top sectio of your website. (Max size: 5MB)</p>
                        </span>

                        <div>
                            <ImageUploadInput
                                handleChange={handleImageChange}
                                name='banner'
                                preview={banner.preview}
                                height={{ height: width < 650 ? "16rem" : "20rem", width: "100%", overflow: "hidden" }}
                                text={<>Recommended dimension: 1450 x 350 <br /> Formats: JPEG, PNG, JPG and SVG</>}
                                handleRemove={() => handleRemoveImage("banner")}
                            />
                        </div>
                    </div>


                    <Line border={1.4} />


                    <div className="custom--item">
                        <span className="custom--labels">
                            <label className='form--label'>Website Headline and Banner Texts <Asterisk /> </label>
                            <p className="custom--subtext">
                                <div><Info /> Website headline is the first section of your website.</div><br />

                                <div><Info />Banner headings and texts will be visible on the store banner.</div>
                            </p>
                        </span>


                        <div className="form--item">
                            <div className="form--item">
                                <label className="form--label">Custom Headlines message</label>
                                <input type="text" name="headline" className="form--input" placeholder='Shop here on luxeware and get 2% discount' value={storeData.headline} onChange={handleStoreDataChange} />
                            </div>

                            <div className="form--item">
                                <label className="form--label">Banner Heading</label>
                                <input type="text" name="bannerHeading" className="form--input" placeholder='Welcome to the Luxxy Town' value={storeData.bannerHeading} onChange={handleStoreDataChange} />
                            </div>

                            <div className="form--item">
                                <label className="form--label">Banner Subheading</label>
                                <input type="text" name="bannerSubHeading" className="form--input" placeholder='A place for beautiful girls to shop' value={storeData.bannerSubHeading} onChange={handleStoreDataChange} />
                            </div>
                        </div>
                    </div>


                    <Line border={1.4} />


                    <div className="custom--item">
                        <span className="custom--labels">
                            <label className='form--label'>Theme, Brand color and Favicon <Asterisk /></label>
                            <p className="custom--subtext">Select or customize your brand color and Favicon</p>
                            <p className="custom--subtext">
                                <div><Info /> The favicon is your store icon that will appear in your browser tab.</div><br />
                            </p>
                        </span>

                        <div className='custom--interface'>
                            <div className="form--item" style={{ gap: "2rem" }}>
                                <div className="colors--container">
                                    {colors.map((color, i) => <ColorBox key={i} color={color} handleSelected={handleSelectColor} selected={customColor.color || selectedColor} />)}
                                </div>

                                <div className='form--flex' style={{ flexWrap: "wrap", gap: "1rem", justifyContent: "flex-start" }}>
                                    <label className='form--label'>Custom Color:</label>
                                    <input type="text" className='form--input' style={{ padding: ".6rem", maxWidth: "12rem" }} value={customColor.color} onChange={handleCustomColor} placeholder='#3423 or grey' />

                                    {/* <div>{customColor.isValid && (
                                        <ColorBox color={customColor.color} selected={customColor.color} />
                                    )}</div> */}

                                    <ColorPicker value={selectedColor || customColor.color} onChange={(value) => setCustomColor({ isValid: true, color: value?.hex })} />
                                </div>

                                {!isnew && (
                                    <div>
                                        <label className='form--label'>Favicon</label>
                                        <FaviconInput 
                                            preview={favicon.preview}
                                            handleChange={handleImageChange}
                                        />
                                    </div>
                                )}
                            </div>


                            <div className='form--item design--item'>
                                <label className="form--label">{!isnew ? "Selected" : "Default"} Templete
                                </label>

                                <div className="custom--display">
                                    <Template1
                                        logo={storeLogo.preview || (store?.storeLogo?.url ? store?.storeLogo?.url : demo_logo)}
                                        color={storeData.brandColor}
                                        headline={storeData.headline}
                                        banner={banner.preview}
                                        heading={storeData.heading}
                                        text={storeData.subHeading}
                                        about={storeData.aboutPage}
                                    />
                                </div>
                                {isnew && <Info text="You can change store templates after later" />}
                            </div>
                        </div>
                    </div>


                    <Line border={1.4} />


                    <div className="custom--item">
                        <span className="custom--labels">
                            <label className='form--label'>
                                About Section (optional)
                                <Switch color='#ff7a49'
                                    checked={storeData.aboutPage}
                                    onClick={() => handleStoreClicks("aboutPage")}
                                />
                            </label>
                            <p className="custom--subtext">Add about section to your store, section on your website that talks about your business</p>
                        </span>

                        <div className='custom--description'>

                            {storeData.aboutPage && (
                                <QuillEditor value={storeData.aboutDescription} setValue={(value) => handleStoreDescriptions("aboutDescription", value)} placeholder='Your About-us Content Here...' />
                            )}
                        </div>
                    </div>


                    <Line border={1.4} />


                    <div className="custom--item">
                        <span className="custom--labels">
                            <label className='form--label'>
                                Return Policy Section (optional)
                                <Switch color='#ff7a49'
                                    checked={storeData.returnPolicyPage}
                                    onClick={() => handleStoreClicks("returnPolicyPage")}
                                />
                            </label>
                            <p className="custom--subtext">Add policy to your store, section on your website that explains your policy</p>
                        </span>

                        <div className='custom--description'>

                            {storeData.returnPolicyPage && <QuillEditor value={storeData.returnPolicyDescription} setValue={(value) => handleStoreDescriptions("returnPolicyDescription", value)} placeholder='Your Policy Content Here...' />}
                        </div>
                    </div>


                    <Line border={1.4} />


                    <div className="custom--item">
                        <span className="custom--labels">
                            <label className='form--label'>Social media Accounts (optional)</label>
                            <p className="custom--subtext">Social icons will be diplayed on your store website to give more credibility about your business</p>
                        </span>

                        <div className="form--item form--socials">
                            <LinkInput url={<AiFillFacebook style={{ fontSize: "2.4rem" }} />} name="facebook" value={storeData.facebook} handleChange={handleStoreDataChange} linkPosition='start' placeholder="Your facebook page" />
                            <LinkInput url={<AiFillInstagram style={{ fontSize: "2.4rem" }} />} name="instagram" value={storeData.instagram} handleChange={handleStoreDataChange} linkPosition='start' placeholder="@ Your instagram handle" />
                            <LinkInput url={<AiFillTwitterSquare style={{ fontSize: "2.4rem" }} />} name="twitter" value={storeData.twitter} handleChange={handleStoreDataChange} linkPosition='start' placeholder="@ Your twitter handle" />
                            <LinkInput url={<AiFillTikTok style={{ fontSize: "2.4rem" }} />} name="tiktok" value={storeData.tiktok} handleChange={handleStoreDataChange} linkPosition='start' placeholder="@ Your tiktok profile" />
                            <LinkInput url={<AiOutlineWhatsApp style={{ fontSize: "2.4rem" }} />} name="whatsapp" value={storeData.whatsapp} handleChange={handleStoreDataChange} linkPosition='start' placeholder="Your whatsapp number" type='number' />
                        </div>
                    </div>


                    <Line border={1.4} />

                    <div className="page__section--actions" style={width > 450 ? { marginLeft: "auto" } : {}}>
                        <button className='button clear--button' onClick={close}>Cancel</button>
                        <button className='button submit--button' onClick={handleSubmitCustomStore} disabled={loading.mainLoading}>Save</button>
                    </div>
                </form>
            </section>
        </React.Fragment>
    )
}