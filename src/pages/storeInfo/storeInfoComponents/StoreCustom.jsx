import React, { useEffect, useState } from 'react'
import { MdOutlineStorefront } from 'react-icons/md';
import { useWindowSize } from 'react-use'
import BackButton from '../../../components/button/BackButton';
import Line from '../../../components/Line';

import ImageUploadUI from '../../../components/ImageUploadUI';
import { useAuthContext } from '../../../context/AuthContext';
import { AiOutlineDelete, AiOutlineLink } from 'react-icons/ai';
import ColorBox from '../../../components/ColorBox';

import LinkInput from '../../../components/LinkInput';
import { Switch } from '@mui/material';
import QuillEditor from '../../../components/QuillEditor';
import TemplateUI from "../../../ui/templateUI";
import Info from '../../../components/Info';
import { colors } from '../../../utils/data';  
  
const BASE_URL = import.meta.env.VITE_BASE_URL;
const noLogo = "../../../../faviconB.png"


function StoreCustom({ isnew, close }) {
    const { width } = useWindowSize();
    const { store } = useAuthContext();
    const { socialProfiles, customDesign, logo, otherPages } = store;

    const logoImg = `${BASE_URL}${logo}`;
    const bannerImg = `${BASE_URL}${customDesign?.banner}`;
    const width450False = width < 450 ? false : true;


    const [imagePreview, setImagePreview] = useState({ banner: null, logo: null });
    const [imageFile, setImageFile] = useState({ banner: null, logo: null });
    const [selectedColor, setSelectedColor] = useState("");
    const [customColor, setCustomColor] = useState({ color: "", isValid: false });

    const [storeData, setStoreData] = useState({
        // name: store?.name || "",
        // storeUrl: store?.storeUrl?.replace(".quicka.store", "") || "",
        headline: store?.headline || "",
        bannerHeading: customDesign?.bannerHeading || "",
        bannerSubheading: customDesign?.bannerSubheading || "",
        brandColor: customDesign?.brandColor || "",

        aboutPage: otherPages?.aboutPage || width450False,
        returnPolicyPage: otherPages?.returnPolicyPage || width450False,
        aboutDescription: otherPages?.aboutDescription || "",
        returnPolicyDescription: otherPages?.returnPolicyDescription || "",

        instagram: socialProfiles?.instagram || "",
        whatsapp: socialProfiles?.whatsapp || "",
        facebook: socialProfiles?.facebook || "",
        twitter: socialProfiles?.twitter || "",
    });


    const handleImageChange = function (event) {
        const name = event.target.name;
        const file = event.target.files[0];

        if (file) {
            setImageFile({ ...imagePreview, [name]: file });
            const imageUrl = URL.createObjectURL(file);
            setImagePreview({ ...imagePreview, [name]: imageUrl });
        }
    };

    const handleRemoveImage = function(name) {
        setImagePreview({ ...imagePreview, [name]: null });
        setImageFile({ ...imageFile, [name]: null });
    }

    function handleSelectColor(color) {
        setSelectedColor(color);
        if(customColor.color) {
            setCustomColor({ color: "", isValid: false });
        }
    }

    function handleCustomColor(e) {
        const color = e.target.value
        setCustomColor({ ...customColor, color });
    }

    const handleStoreClicks = function(name) {
        setStoreData({ ...storeData, [name]: !storeData[name] })
    }

    const handleStoreDescriptions = function(name, value) {
        setStoreData({ ...storeData, [name]: value });
    }

    const handleStoreDataChange = function (e) {
        const { name, value } = e?.target;
        console.log(name, value)
        let sanitizedValue;

        // HERE SANITIZES THE TEXT AND THE URL
        if (name === "name") {
            sanitizedValue = value.replace(/[^a-zA-Z0-9\s]/g, '').replace(/^\s+/, '');
        } else if (name === "storeUrl") {
            sanitizedValue = value.replace(/[^a-zA-Z0-9-]/g, '').replace(/^\s+|\s+$/g, '');
        } else {
            sanitizedValue = value;
        }

        console.log(value, sanitizedValue)

        setStoreData({
            ...storeData,
            [name]: sanitizedValue || value,
        });
    };

    // SANITIZE THE NAME AS THE LINK, REPLACING SPACES WITH -
    useEffect(function () {
        const sanitizedUrl = storeData?.name?.replace(/\s+/g, '-').toLowerCase();
        setStoreData({ ...storeData, storeUrl: sanitizedUrl })
    }, [storeData?.name]);

    // SET COLORS BUT CHECK IF COLOR IS VALID FIRST
    useEffect(function() {
        const color = customColor.color;
        const check  = new Option().style;
        check.color = color;
        
        if(check.color.length > 0) {
            setCustomColor({ ...customColor, isValid: true });
            setSelectedColor("");
        } else {
            setCustomColor({ ...customColor, isValid: false });
        }
    }, [customColor.color]);

    // SET THE BRAND COLOR
    useEffect(function() {
        if((customColor.color && customColor.isValid) || selectedColor) {
            setStoreData({ ...storeData, brandColor: (customColor.color || selectedColor) });
        } else {
            setStoreData({ ...storeData, brandColor: "" });
        }
    }, [customColor, selectedColor]);

    useEffect(function () {
        !isnew && window.scrollTo(0, 0);
    }, []);

  return (
    <section className='product__upload-section'>
            <div className='page__section--heading'>
                <span className='flex justify'>
                    <BackButton close={close} />
                    <h2 className="page__section--title">Customize Your Store<MdOutlineStorefront /></h2>
                </span>
            </div>


            <div className="product__upload--container custom">

                {width < 600 && <Line border={1.4} />}

                <div className='custom--head'>
                    <div className="form--element">
                        <span><img src={logo ? logoImg : (imagePreview.logo || noLogo)} alt="brand logo" /></span>

                        <div className='form--item'>
                            <input type='file' id='logo' name='logo' onChange={handleImageChange} accept="image/*" />

                            <div className="flex" style={{ flexDirection: "row"}}>
                                <label htmlFor="logo" className='form--upload-btn'>{(store?.logo || imagePreview.logo) ? "Change" : "Upload"} Logo</label>

                                {imagePreview.logo && <button onClick={() => handleRemoveImage("logo")} className='form--upload-btn' style={{ padding: ".45rem .68rem", fontSize: "2rem", color: "red", backgroundColor: "#eee" }}><AiOutlineDelete /></button>}

                            </div>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.4' }}>
                                png or jpg up to 2MB. {width < 450 && <br />}Recommended size 256x256</p>
                        </div>
                    </div>
                    

                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span className='custom--labels' style={{ gap: ".6rem"}}>
                            <h3 className='custom--title'>{store?.name}</h3>

                            <a className='custom--link' target='_blank' href={`https://${store?.storeUrl}`} >
                                https://{store?.storeUrl} <AiOutlineLink />
                            </a>
                        </span>

                        {width > 500 && (
                            <div className="page__section--actions">
                                <button className='button clear--button' onClick={close}>Cancel</button>
                                <button className='button submit--button'>Save</button>
                            </div>
                        )}
                    </div>
                </div>


                {/* <Line border={1.4} />


                <div className="custom--item">
                    <span className="custom--labels">
                        <label className='form--label'>Business Info (Required) <Asterisk /></label>
                        <p className="custom--subtext">Lorem ipsum dolor sit amet consectetur.</p>
                    </span>

                    <div className="form--item">
                        <div className="form--item">
                            <label className='form--label'>Business Name</label>
                            <input type="text" name="name" className="form--input" placeholder='Business name' value={storeData.name} onChange={handleStoreDataChange} readOnly />
                        </div>
                        
                        <div className="form--item">
                            <label className='form--label'>Store URL</label>
                            <LinkInput url='.quicka.store' name="storeUrl" value={storeData.storeUrl} handleChange={handleStoreDataChange} linkPosition="end" readOnly={true} />
                        </div>
                    </div>
                </div> */}


                <Line border={1.4} />


                <div className="custom--item" style={width < 800 ? { gridTemplateColumns: "1fr", gap: "2rem" } : {}}>
                    <span className="custom--labels">
                        <label className='form--label'>Store Banner (optional)</label>
                        <p className="custom--subtext">This is the image on the top sectio of your website. (Max size: 5MB)</p>
                    </span>

                    <div>
                        <ImageUploadUI 
                            handleChange={handleImageChange}
                            name='banner'
                            preview={customDesign?.banner ? bannerImg : imagePreview.banner}
                            height={{ height: width < 650 ? "14rem" : "20rem", width: "100%", padding: width < 400 ? 0 : "1rem 0", overflow: "hidden" }}
                            text="Recommended dimension: 1440 x 350"
                            handleRemove={() => handleRemoveImage("banner")}
                        />
                    </div>
                </div>


                <Line border={1.4} />


                <div className="custom--item">
                    <span className="custom--labels">
                        <label className='form--label'>Website Headline and Banner Texts (optional)</label>
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
                            <input type="text" name="bannerHeading" className="form--input" placeholder='Welcome to' value={storeData.bannerHeading} onChange={handleStoreDataChange} />
                        </div>

                        <div className="form--item">
                            <label className="form--label">Banner text</label>
                            <input type="text" name="bannerSubheading" className="form--input" placeholder='Luxewares' value={storeData.bannerSubheading} onChange={handleStoreDataChange} />
                        </div>
                    </div>
                </div>


                <Line border={1.4} />


                <div className="custom--item">
                    <span className="custom--labels">
                        <label className='form--label'>Theme / Brand color (optional)</label>
                        <p className="custom--subtext">Select or customize your brand color.</p>
                    </span>

                    <div className='custom--interface'>
                        <div className="form--item" style={{ gap: "2rem" }}>
                            <div className="colors--container">
                                {colors.map(color => <ColorBox color={color} handleSelected={handleSelectColor} selected={customColor.color || selectedColor} /> )}
                            </div>

                            <div className='form--flex' style={{ gap: "1rem", justifyContent: "flex-start" }}>
                                <label className='form--label'>Custom Color:</label>
                                <input type="text" className='form--input' style={{ padding: ".6rem", maxWidth: "12rem" }} value={customColor.color} onChange={handleCustomColor} placeholder='#3423 or grey' />
                                <div>{customColor.isValid && (
                                    <ColorBox color={customColor.color} selected={customColor.color} />
                                )}</div>
                            </div>
                        </div>


                        <div className="custom--display">
                            <TemplateUI 
                                logo={logo ? logoImg : (imagePreview.logo || noLogo)}
                                color={storeData.brandColor}
                                headline={storeData.headline}
                                banner={customDesign?.banner ? bannerImg : imagePreview.banner}
                                heading={storeData.bannerHeading}
                                text={storeData.bannerSubheading}
                                about={storeData.aboutPage}
                            />
                        </div>
                    </div>
                </div>


                <Line border={1.4} />

                        
                <div className="custom--item">
                    <span className="custom--labels">
                        <label className='form--label'>About Section (optional)</label>
                        <p className="custom--subtext">Add about section to your store, section on your website that talks about your business</p>
                    </span>
                    
                    <div className='custom--description'>
                        <Switch color='#ff7a49' 
                            checked={storeData.aboutPage}
                            onClick={() => handleStoreClicks("aboutPage")}
                        />
                        
                        {storeData.aboutPage && <QuillEditor value={storeData.aboutDescription} setValue={(value) => handleStoreDescriptions("aboutDescription", value) } />}
                    </div>
                </div>
                

                <Line border={1.4} />


                <div className="custom--item">
                    <span className="custom--labels">
                        <label className='form--label'>Return Policy Section (optional)</label>
                        <p className="custom--subtext">Add policy to your store, section on your website that explains your policy</p>
                    </span>
                    
                    <div className='custom--description'>
                        <Switch color='#ff7a49'
                        checked={storeData.returnPolicyPage}
                        onClick={() => handleStoreClicks("returnPolicyPage")} />
                        
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
                        <LinkInput url='www.facebook/' name="facebook" value={storeData.facebook} handleChange={handleStoreDataChange} linkPosition='start' placeholder="Your link" />
                        <LinkInput url='www.instagram/' name="instagram" value={storeData.instagram} handleChange={handleStoreDataChange} linkPosition='start' placeholder="Your link" />
                        <LinkInput url='www.twitter/' name="twitter" value={storeData.twitter} handleChange={handleStoreDataChange} linkPosition='start' placeholder="Your link" />
                        <LinkInput url='www.https://wa.me/' name="whatsapp" value={storeData.whatsapp} handleChange={handleStoreDataChange} linkPosition='start' placeholder="Your link" />
                    </div>
                </div>


                <Line border={1.4} />

                <div className="page__section--actions" style={ width > 450 ? { marginLeft: "auto" } : {}}>
                    <button className='button clear--button' onClick={close}>Cancel</button>
                    <button className='button submit--button'>Save</button>
                </div>

           </div>

           
        </section>
  )
}

export default StoreCustom