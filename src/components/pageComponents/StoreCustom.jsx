import React, { useEffect, useState } from 'react'
import { MdOutlineStorefront } from 'react-icons/md';
import { useWindowSize } from 'react-use'
import BackButton from '../button/BackButton';
import Line from '../elements/Line';

import ImageUploadInput from '../form/ImageUploadInput';
import { useAuthContext } from '../../context/AuthContext';
import { AiOutlineDelete, AiOutlineLink } from 'react-icons/ai';
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
import isOnline from 'is-online';
import LogoUploadInput from '../form/LogoUploadInput';

const BASE_API_URL = import.meta.env.VITE_API_URL;
const noLogo = "../../../../faviconB.png"


function StoreCustom({ isnew, close }) {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { store, shouldKick, handleStore, formdataHeader } = useAuthContext();
    const { handleFetchError } = useFetchedContext();

    const width450False = width < 450 ? false : true;

    const [loading, setLoading] = useState({ mainLoading: false, imageLoading: false });
    const [response, setResponse] = useState({ status: null, message: null });
    const [showConfetti, setShowConfetti] = useState(false);

    const [imagePreview, setImagePreview] = useState({ banner: null, logo: null });
    const [imageFile, setImageFile] = useState({ banner: null, logo: null });
    const [selectedColor, setSelectedColor] = useState("");
    const [customColor, setCustomColor] = useState({ color: "", isValid: false });

    const [storeData, setStoreData] = useState({
        headline: "",
        heading: "",
        subHeading: "",
        brandColor: "",

        aboutPage: width450False,
        returnPolicyPage: width450False,
        aboutDescription: "",
        returnPolicyDescription: "",

        instagram: "",
        whatsapp: store?.contact?.phone ? store?.contact?.phone : "",
        facebook: "",
        twitter: "",
        tiktok: "",
    });


    const handleImageChange = function (event) {
        const name = event.target.name;
        const file = event.target.files[0];

        if (file) {
            setImageFile({ ...imageFile, [name]: file });
            const imageUrl = URL.createObjectURL(file);
            setImagePreview({ ...imagePreview, [name]: imageUrl });
        }
    };

    const handleRemoveImage = function (name) {
        setImagePreview({ ...imagePreview, [name]: null });
        setImageFile({ ...imageFile, [name]: null });
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

        if(name == "tiktok") {
            modified = value?.replace(/^@?/, '@')?.replace(/\s+/g, '');
        } else {
            modified = value
        }

        setStoreData({ ...storeData, [name]: modified });
    };

    function handleCustomColor(e) {
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

    async function handleSubmitCustomStore() {
        console.log(storeData, imageFile);

        // SET LOADER
        handleResetResponse()
        handleLoading("mainLoading", true);

        const {
            instagram, whatsapp, facebook, twitter,
            headline, heading, subHeading, brandColor,
            aboutDescription, returnPolicyDescription
        } = storeData;
        const socialProfiles = { instagram, whatsapp, facebook, twitter };
        const customDetail = { heading, subHeading, brandColor, headline };
        const otherPages = { aboutDescription, returnPolicyDescription,
            aboutPage: aboutDescription ? true : false,
            returnPolicyPage: returnPolicyDescription ? true : false,
        }

        const formData = new FormData();
        formData.append("socialProfiles", JSON.stringify(socialProfiles));
        formData.append("customDetail", JSON.stringify(customDetail));
        formData.append("otherPages", JSON.stringify(otherPages));
        formData.append("logo", imageFile.storeLogo);
        formData.append("banner", imageFile.banner);

        try {
            // CHECK CONNECTION
            const connected = await isOnline();
            if(!connected) throw new Error("Internet Error");
            
            // MAKE REQUEST
            const res = await fetch(`${BASE_API_URL}/stores/onboard/store`, {
                method: "PATCH",
                headers: formdataHeader,
                body: formData
            });
            shouldKick(res)

            const data = await res.json();
            if (data?.status != 'success') throw new Error(data?.message);
            isnew && setShowConfetti(true);

            // SET RESPONSE MESSAGE and MODIFY STORE IN THE COOKIE
            setResponse({ status: "success", message: data?.message });
            handleStore(data?.data?.store);

            setTimeout(function () {
                if (isnew) close();
                else navigate(-1)
            }, isnew ? 5000 : 3000);

        } catch (err) {
            const message = handleFetchError(err?.message)
            setResponse({ status: "error", message });
        } finally {
            handleLoading("mainLoading", false);
        }
    }

    return (
        <>

            {showConfetti && <Confetti customHeight={2500} customGv={0.1} />}
            {loading.mainLoading && createPortal(<Spinner />, document.body)}
            {(response.message || response.status) && (
                createPortal(<CustomAlert type={response.status} message={response.message} />, document.body)
            )}

            <section className='product__upload-section'>
                <div className='page__section--heading'>
                    <span className='flex justify'>
                        <BackButton close={close} />
                        <h2 className="page__section--title">Customize Your Store<MdOutlineStorefront /></h2>
                    </span>
                </div>
                

                <form className="product__upload--container custom"  onSubmit={e => e.preventDefault()}>

                    {width < 600 && <Line border={1.4} />}

                    <div className='custom--head'>
                        <LogoUploadInput
                            logoPreview={imagePreview.storeLogo}
                            handleLogoChange={handleImageChange}
                            handleLogoRemove={() => handleRemoveImage("logo")}
                        />

                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span className='custom--labels' style={{ gap: ".6rem" }}>
                                <h3 className='custom--title'>{store?.name}</h3>

                                <a className='custom--link' target='_blank' href={`https://${store?.storeUrl}`} >
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
                                preview={imagePreview.banner}
                                height={{ height: width < 650 ? "14rem" : "20rem", width: "100%", padding: width < 400 ? 0 : "1rem 0", overflow: "hidden" }}
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
                                <input type="text" name="heading" className="form--input" placeholder='Welcome to' value={storeData.heading} onChange={handleStoreDataChange} />
                            </div>

                            <div className="form--item">
                                <label className="form--label">Banner Subheading</label>
                                <input type="text" name="subHeading" className="form--input" placeholder='Luxewares' value={storeData.subHeading} onChange={handleStoreDataChange} />
                            </div>
                        </div>
                    </div>


                    <Line border={1.4} />


                    <div className="custom--item">
                        <span className="custom--labels">
                            <label className='form--label'>Theme / Brand color <Asterisk /></label>
                            <p className="custom--subtext">Select or customize your brand color.</p>
                        </span>

                        <div className='custom--interface'>
                            <div className="form--item" style={{ gap: "2rem" }}>
                                <div className="colors--container">
                                    {colors.map(color => <ColorBox color={color} handleSelected={handleSelectColor} selected={customColor.color || selectedColor} />)}
                                </div>

                                <div className='form--flex' style={{ gap: "1rem", justifyContent: "flex-start" }}>
                                    <label className='form--label'>Custom Color:</label>
                                    <input type="text" className='form--input' style={{ padding: ".6rem", maxWidth: "12rem" }} value={customColor.color} onChange={handleCustomColor} placeholder='#3423 or grey' />
                                    <div>{customColor.isValid && (
                                        <ColorBox color={customColor.color} selected={customColor.color} />
                                    )}</div>
                                </div>
                            </div>


                            <div className='form--item'>
                                <label className="form--label">Default Templete</label>

                                <div className="custom--display">
                                    <Template1
                                        logo={imagePreview.storeLogo || (store?.storeLogo?.url ? store?.storeLogo?.url : noLogo)}
                                        color={storeData.brandColor}
                                        headline={storeData.headline}
                                        banner={imagePreview.banner}
                                        heading={storeData.heading}
                                        text={storeData.subHeading}
                                        about={storeData.aboutPage}
                                    />
                                </div>
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
                                <QuillEditor value={storeData.aboutDescription} setValue={(value) => handleStoreDescriptions("aboutDescription", value)} />
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

                            {storeData.returnPolicyPage && <QuillEditor value={storeData.returnPolicyDescription} setValue={(value) => handleStoreDescriptions("returnPolicyDescription", value)} />}
                        </div>
                    </div>



                    <Line border={1.4} />


                    <div className="custom--item">
                        <span className="custom--labels">
                            <label className='form--label'>Social media Accounts (optional)</label>
                            <p className="custom--subtext">Social icons will be diplayed on your store website to give more credibility about your business</p>
                        </span>

                        <div className="form--item">
                            <LinkInput url='www.facebook.com/' name="facebook" value={storeData.facebook} handleChange={handleStoreDataChange} linkPosition='start' placeholder="Your link" />
                            <LinkInput url='www.instagram.com/' name="instagram" value={storeData.instagram} handleChange={handleStoreDataChange} linkPosition='start' placeholder="Your link" />
                            <LinkInput url='www.twitter.com/' name="twitter" value={storeData.twitter} handleChange={handleStoreDataChange} linkPosition='start' placeholder="Your link" />
                            <LinkInput url='www.tiktok.com/' name="tiktok" value={storeData.tiktok} handleChange={handleStoreDataChange} linkPosition='start' placeholder="Your link" />
                            <LinkInput url='https://wa.me/' name="whatsapp" value={storeData.whatsapp} handleChange={handleStoreDataChange} linkPosition='start' placeholder="Your link" />
                        </div>
                    </div>


                    <Line border={1.4} />

                    <div className="page__section--actions" style={width > 450 ? { marginLeft: "auto" } : {}}>
                        <button className='button clear--button' onClick={close}>Cancel</button>
                        <button className='button submit--button' onClick={handleSubmitCustomStore}>Save</button>
                    </div>

                </form>
            </section>
        </>
    )
}

export default StoreCustom