import React, { useEffect, useState } from 'react'
import { MdOutlineStorefront } from 'react-icons/md';
import { useWindowSize } from 'react-use'
import BackButton from '../../../components/button/BackButton';
import Line from '../../../components/Line';

import noImg from '../../../assets/images/png_elements/flutterwave-store.png'
import { Link } from 'react-router-dom';
import ImageUploadUI from '../../../components/ImageUploadUI';
import { useAuthContext } from '../../../context/AuthContext';
import Asterisk from '../../../components/Asterisk';
import { AiOutlineLink } from 'react-icons/ai';
import ColorBox from '../../../components/ColorBox';

import sample from "../../../assets/images/themes/original-5fd4642ef1335c41fba6b920ab037b3d.png"

const colors = ["red", "black", "lightblue", "violet", "gold", "pink", "#CCDDDD", "#008B02"]

function StoreCustom({ isnew, close }) {
    const { width } = useWindowSize();
    const { store } = useAuthContext();

    const [imagePreview, setImagePreview] = useState({ banner: null, logo: null });
    const [imageFile, setImageFile] = useState({ banner: null, logo: null });
    const [selectedColor, setSelectedColor] = useState("");
    const [customColor, setCustomColor] = useState({ color: "", isValid: false });

    const [storeData, setStoreData] = useState({
        name: store?.name || "",
        storeUrl: store?.storeUrl?.replace(".quicka.store", "") || ""
    })

    const handleImageChange = function (event) {
        const name = event.target.name;
        const file = event.target.files[0];

        if (file) {
            setImageFile({ ...imagePreview, [name]: file });
            const imageUrl = URL.createObjectURL(file);
            setImagePreview({ ...imagePreview, [name]: imageUrl });
        }
    };

    function handleSelectColor(color) {
        setSelectedColor(color)
    }

    function handleCustomColor(e) {
        const color = e.target.value
        setCustomColor({ ...customColor, color })
    }

    const handleStoreDataChange = function (e) {
        const { name, value } = e?.target;
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

    useEffect(function() {
        const color = customColor.color;
        const check  = new Option().style;
        check.color = color
        
        if(check.color.length > 0) {
            setCustomColor({ ...customColor, isValid: true });
            setSelectedColor("")
        } else {
            setCustomColor({ ...customColor, isValid: false });
        }
    }, [customColor.color])


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


            <div className="product__upload--container" style={{ gridTemplateColumns: "1fr", margin: "0 auto", gap: "2.8rem" }}>
                {width < 600 && <Line border={1.4} />}


                <div className='custom--head'>
                    <div className="form--element">
                        <span><img src={imagePreview.logo || noImg} alt="brand logo" /></span>

                        <div className='form--item'>
                            <input type='file' id='logo' name='logo' onChange={handleImageChange} accept="image/*" />

                            <label htmlFor="logo" className='form--upload-btn'>{store?.logo ? "Change" : "Upload"} Logo</label>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.4' }}>png or jpg up to 2MB. Recommended size 256x256</p>
                        </div>
                    </div>
                    
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span className='custom--labels' style={{ gap: ".2rem"}}>
                            <h3>{storeData.name || store?.name}</h3>
                            <Link className='custom--link' to={`https://${store?.storeUrl}`}>www.{storeData.storeUrl || store?.storeUrl} <AiOutlineLink /></Link>
                        </span>

                        {width > 500 && (
                            <div className="page__section--actions">
                                <button className='button clear--button' onClick={close}>Cancel</button>
                                <button className='button submit--button'>Save</button>
                            </div>
                        )}
                    </div>
                </div>


                <Line border={1.4} />


                <div className="custom--item">
                    <span className="custom--labels">
                        <label className='form--label'>Business name <Asterisk /></label>
                        <p className="custom--subtext">Lorem ipsum dolor sit amet consectetur.</p>
                    </span>

                    <div className="form--item">
                        <input type="text" name="name" className="form--input" placeholder='Business name' value={storeData.name} onChange={handleStoreDataChange} />
                        
                        <div className="form--input-box">
                            <input type="text" id='storeUrl' className="form--input" placeholder='Store url' name='storeUrl' value={storeData.storeUrl} onChange={handleStoreDataChange} />
                            <span className='url--box'>.quicka.store</span>
                        </div>
                    </div>
                </div>


                <Line border={1.4} />


                <div className="custom--item" style={{ gridTemplateColumns: width < 800 ? "1fr" : "1fr 2fr" }}>
                    <span className="custom--labels">
                        <label className='form--label'>Store Banner (optional)</label>
                        <p className="custom--subtext">This is the image on the top sectio of your website. (Max size: 5MB)</p>
                    </span>

                    <div>
                        <ImageUploadUI 
                            handleChange={handleImageChange}
                            name='banner'
                            preview={imagePreview.banner}
                            height={{ height: width < 650 ? "14rem" : "20rem", width: "100%", padding: width < 400 ? 0 : "1rem 0", overflow: "hidden" }}
                            text="Recommended dimension: 1440 x 350"
                        />
                    </div>
                </div>

                <Line border={1.4} />

                <div className="custom--item" style={{ gridTemplateColumns: width > 900 ? "1fr 2fr" : ""}}>
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
                            <img src={sample} alt="" />
                        </div>
                    </div>
                </div>

                <Line border={1.4} />

           </div>

           
        </section>
  )
}

export default StoreCustom