import React, { useEffect, useState } from 'react'
import Asterisk from '../elements/Asterisk'
import { useAuthContext } from '../../context/AuthContext'
import CurrencyInput from 'react-currency-input-field';
import { CiImageOn } from 'react-icons/ci';
import { Switch } from '@mui/material';
import Info from '../elements/Info';
import ImageUploadInput from '../form/ImageUploadInput';
import RadioInput from '../form/RadioInput';
import { validateVariantForm } from '../../utils/validationHelper';

export default function AddProductVariationFormSm({ images, setImages, close, setVariations }) {
    const { currency, store } = useAuthContext();
    const maxImageAmount = store?.subscription?.type == "free" ? 4 : 10;

    const [variantFormErrors, setVariantFormErrors] = useState({});
    const [allowImage, setAllowImage] = useState(false);
    const [variant, setVariant] = useState({ 
        image: "", type: "", value: "", price: null, quantity: null, itemCost: null, discountType: "no-discount", discountValue: null
    });

    const [uploadedImage, setUploadedImage] = useState({ file: null, data_url: null });
    const [previewImages, setPreviewimages] = useState();


    // HANDLE VARIATION INPUTS
    const handleChangeVariant = function(e) {
        const { name, value } = e?.target;
        setVariant({ ...variant, [name]: value });
    }

    // VARIATION IMAGE
    const handleOnChangeVariationImage = function(event) {
        const file = event.target.files[0];
        if (file) {
            const data_url = URL.createObjectURL(file);
            setVariant({ ...variant, image: data_url });
            setUploadedImage({ data_url, file });
            setPreviewimages([...previewImages, { data_url, file }]);
        }
    }

    const handleSaveVariant = function() {
        const newErrors = validateVariantForm(variant);
        setVariantFormErrors(newErrors);
        if (Object.keys(newErrors).length >= 1) return;

        setVariations(prev => 
            [...prev, variant]
        );
        setImages([...images, uploadedImage]);
        close();
    }

    // HELP TO SET AND RESET THE PREVIEW IMAGES
    useEffect(function() {
        setPreviewimages([...images]);
    }, [allowImage]);


    return (
        <div className='flex-column-spbtw' style={{ height: "90%" }}>
            <div className="form--variation" style={{ marginTop: "2.8rem" }}>
                <div className='form--item'>
                    <label className='form--label flex'>Option Image (Optional) <Switch color='#ff7a49' size="small" checked={allowImage} onClick={() => setAllowImage(!allowImage)} /></label>
                    {allowImage && (
                        <React.Fragment>
                            <Info text="Choose from the existing images you have uploaded or upload a new image for the variation." />
                            {previewImages?.length > 0 ? (
                                <div className='modal--img-grid'>
                                    {previewImages?.map((img, i) => (
                                        <span className={`modal--img ${img?.data_url == variant?.image ? "selected" : ""}`} onClick={() => setVariant({...variant, image: variant.image == img?.data_url ? "" : img?.data_url})}>
                                            <img src={img?.data_url} alt={`product image ${i + 1}`} />
                                        </span>
                                    ))}

                                    {previewImages.length < maxImageAmount && <ImageUploadInput title="Select Image" height={{ height: "8rem" }} handleChange={handleOnChangeVariationImage} />}
                                </div>
                            ) : (
                                <ImageUploadInput height={{ height: "10rem" }} handleChange={handleOnChangeVariationImage} />
                            )}

                        </React.Fragment>
                    )}
                </div>

                <div className="form--item">
                    <label htmlFor="variantType" className='form--label'>Option type <Asterisk /></label>
                    <input type='text' name='type' id='variantType' className='form--input' placeholder='Like: color, size, etc' value={variant?.type} onChange={e => handleChangeVariant(e)} />
                    <span className="form--error-message">
                        {variantFormErrors.type && variantFormErrors.type}
                    </span>
                </div>

                <div className="form--grid">
                    <div className="form--item">
                        <label htmlFor="variantVal" className='form--label'>Option value <Asterisk /></label>
                        <input type='text' name='value' id='variantVal' className='form--input' placeholder='Like: red, 34, big, etc' value={variant?.value} onChange={e => handleChangeVariant(e)} />
                        <span className="form--error-message">
                            {variantFormErrors.value && variantFormErrors.value}
                        </span>
                    </div>

                    <div className="form--item">
                        <label htmlFor="variantQt" className='form--label'>Option Quantity (Optional)</label>
                        <CurrencyInput name='quantity' id='variantQt' className='form--input' placeholder='10' value={variant?.quantity} onValueChange={(value, name, _) => handleChangeVariant({ target: { name, value } })} />
                    </div>
                </div>

                <div className="form--grid">
                    <div className="form--item">
                        <label htmlFor="variantPrice" className='form--label'>Option Price ({currency}) <Asterisk /></label>
                        <CurrencyInput name='price' id='variantPrice' className='form--input' placeholder={currency + "5,000"} prefix={currency} value={variant?.price} onValueChange={(value, name, _) => handleChangeVariant({ target: { name, value } })} />
                        <span className="form--error-message">
                            {variantFormErrors.price && variantFormErrors.price}
                        </span>
                    </div>

                    <div className="form--item">
                        <label htmlFor="variantCostPrice" className="form--label">Cost per item (optional)</label>
                        <CurrencyInput
                            id="variantCostPrice"
                            name="itemCost"
                            className="form--input"
                            placeholder={`${currency}2,000`}
                            prefix={currency}
                            value={variant?.itemCost}
                            onValueChange={(value, name, _) => handleChangeVariant({ target: { name, value } })}
                        />
                        <span className="form--error-message">
                            {variantFormErrors.itemCost && variantFormErrors.itemCost}
                        </span>
                    </div>
                </div>

                <div className="form--item">
                    <label className="form--label">Discount Type (optional)</label>

                    <div className="form--item-flex" style={{ gap: "1.8rem" }}>
                        <div className="radio--item" onClick={() => setVariant({ ...variant, discountType: "no-discount" })}>
                            <RadioInput active={variant?.discountType === "no-discount"} />
                            <span className="radio--text">No Discount</span>
                        </div>

                        <div className="radio--item" onClick={() => setVariant({ ...variant, discountType: "percentage" })}>
                            <RadioInput active={variant?.discountType === "percentage"} />
                            <span className="radio--text">Percentage</span>
                        </div>

                        <div className="radio--item" onClick={() => setVariant({ ...variant, discountType: "fixed-price" })}>
                            <RadioInput active={variant?.discountType === "fixed-price"} />
                            <span className="radio--text">Fixed Value</span>
                        </div>
                    </div>
                </div>

                {(variant.discountType !== "no-discount") && (
                    <div className="form--item">
                        <label htmlFor="discount-price" className="form--label">Discount Price <Asterisk /></label>
                        <CurrencyInput
                            id="discount-price"
                            name="discountValue"
                            className="form--input"
                            placeholder={variant.discountType == "fixed-price" ? `${currency}1,000` : "20%"}
                            value={variant.discountValue}
                            {...(variant.discountType == "fixed-price") ? { prefix: currency } : { suffix: "%" }}
                            decimalsLimit={variant.discountType == "fixed-price" ? 2 : 0}
                            onValueChange={(value, name, _) => setVariant({ ...variant, [name]: value })}
                        />
                        <span className="form--error-message">
                            {variantFormErrors.discountValue && variantFormErrors.discountValue}
                        </span>
                    </div>
                )}
            </div>


            <div className="page__section--actions">
                <button className='button clear--button' onClick={() => close()}>Cancel</button>
                <button className="button submit--button" onClick={handleSaveVariant}>Save</button>
            </div>
        </div>
    )
}
