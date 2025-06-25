import React, { useEffect, useState } from 'react'
import { BiChevronDown, BiChevronUp, BiMinus, BiPlus } from 'react-icons/bi'
import { AiOutlineClose } from 'react-icons/ai';
import { formatNumber, truncateString } from '../../utils/helper';
import { useAuthContext } from '../../context/AuthContext';
import CurrencyInputField from '../form/CurrencyInputField';
import CollapsibleDiv from 'react-collapsible';
import { CgOptions } from 'react-icons/cg';
import SimpleModal from '../modal/SimpleModal';
import { createPortal } from 'react-dom';
import Asterisk from '../elements/Asterisk';
import CustomAlert from './CustomAlert';



export default function ProductQuantityCard
    ({ product, quantity, onQuantityChange, removeItem, discount, setDiscount, variations, onSaveVariations }) {
    const { currency } = useAuthContext();
    
    const [response, setResponse] = useState({ message: "", status: "" })
    const [loader, setLoader] = useState(true);
    const [subTotal, setSubTotal] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [options, setOptions] = useState({});
    const [inStock, setInStock] = useState(true);


    const handleIncrement = function() {
        if(inStock) {
            onQuantityChange(quantity + 1);
        }
    };
    
    const handleDecrement = function() {
        onQuantityChange(Math.max(quantity - 1, 1));
    };

    ///////////////////////////////////////////////
    ///////////////////////////////////////////////
    const findVariation = (variations) => {
        const optionValues = Object?.values(options)?.map(value => value?.toLowerCase());
        // HERE WE FIND THE VARIANT BY THE PICKED OPTIONS
        return variations?.find(variation => {
            const variationName = variation?.name?.toLowerCase();
            return optionValues?.every(value => variationName?.includes(value));
        });
    }

    const handleChangeOption = function(e, name) {
        setOptions(prev => ({ ...prev, [name]: e?.target?.value }))
    }

    const handleSaveOptions = function() {
        const emptyOptions = product.variationOptions.filter(option => !options[option?.label]);
        if(emptyOptions?.length > 0) {
            setResponse({ status: "error", message: "Fill up variation options!" });
            setTimeout(() => setResponse({ status: "", message: "" }), 5000);
            return;
        }
            
        onSaveVariations(options)
        setShowModal(false);
    }

    useEffect(function() {
        setOptions(variations);
    }, []);

    // THIS EFFECT REACTS AND DOES THE SUBTOTAL CALCULATION (COMPLEX)
    useEffect(function() {
        let productTotal;

        // IF PRODUCT HAS VARIATION
        if(product?.hasVariation) {

            // AND THE VARIATION HAS BEEN SELECTED (THE QUANTITY CHANGES TO 1 FROM THE DEFAULT 0 FOR PRODUCT WITH VARIATION AS AT FIRST WE DO NOT KNOW WHAT VARIANT IS TO BE SOLD)
            if(quantity) {
                const variant = findVariation(product?.variations);
                const itemPrice = variant ? variant?.price : (product?.price || 0);
                const itemQuantity = variant ? variant?.quantity : 0;
                setInStock(variant && itemQuantity >= quantity)
                productTotal = itemPrice * quantity
            } else {
                // ELSE, THEY HAVENT SELECTED A VARIANT AND THEREFORE QUANTITY IS STILL THE DEFAULT 0
                productTotal = 0 * quantity
            }

            // BUT IF PRODUCT HAS NO VARIATION, DO THE NORMAL (AS THE DEFAULT QUANTITY FOR THEM IS 1)
        } else {
            setInStock(product?.stockAmount && product?.stockAmount >= quantity)
            productTotal = product?.price * quantity;
        }

        // THEN CALCULATE THE SUBTOTAL
        setSubTotal(productTotal - (discount || 0) )
    }, [quantity, discount, options])


    return (
        <React.Fragment>
            {(response.message || response.status) && (
                createPortal(<CustomAlert type={response.status} message={response.message} />, document.body)
            )}

            {showModal && (
                createPortal(
                    <SimpleModal
                        title="Select Options"
                        icon={<AiOutlineClose />}
                        setClose={setShowModal}
                    >
                        <div className="form--variation">
                            <div className="form--grid">
                                {product?.variationOptions?.map(option => (
                                    <div className="form--item" key={option?.id}>
                                        <label htmlFor={option?.id} className='form--label'>{option?.label} <Asterisk /></label>
                                        <select name={option?.name} id={option?.id} className='form--select' value={options && options[option?.label]} onChange={e => handleChangeOption(e, option?.label)}>
                                            <option selected disabled hidden>Select {option?.label}</option>
                                            {option?.values?.map(value => (
                                                <option value={value}>{value}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>

                            <div className="form--item" style={{ marginTop: "1rem" }}>
                                <label className='form--label'>({currency})Discount (optional)</label>
                                <CurrencyInputField name="discount" value={discount} setValue={setDiscount} shared={false} />
                            </div>

                            <div className="page__section--actions">
                                <button className='button clear--button' onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="button submit--button" onClick={() => handleSaveOptions()}>Save</button>
                            </div>
                        </div>
                    </SimpleModal>,
                    document.body
                )
            )}

            <figure className='product--quantity-figure'>
                <div className={`img-box ${(!inStock) ? "out-of-stock" : ""}`} style={{ height: "70%", overflow: "hidden" }}>
                    <img src={product?.mainImageUrl} alt={product?.name} />
                    <span onClick={() => removeItem(product._id)}><AiOutlineClose /></span>
                </div>

                <div className="product--quantity-details">
                    <p className='title'>
                        {truncateString(product?.name, 15)}
                    </p>

                    <span className='price'>
                        {!product?.hasVariation ? (
                            <React.Fragment>
                                {currency}
                                <span className='value'>
                                    {formatNumber(subTotal || 0)}
                                </span>
                            </React.Fragment>
                        ) : (
                            <span className="value">{!quantity ? product?.priceInFigure : (currency + formatNumber(subTotal || 0))}</span>
                        )}
                    </span>

                    {product?.hasVariation && (
                        <button className='form--add' style={{ width: "fit-content" }} onClick={() => setShowModal(true)}>
                            <p style={{ fontSize: "1.14rem" }}>Select Options</p>
                            <CgOptions style={{ fontSize: "1.7rem" }} />
                        </button>
                    )}

                    {!product?.hasVariation && (
                        <CollapsibleDiv 
                            trigger={
                                <button className='form--add'>
                                    <p style={{ fontSize: "1.14rem" }}>Add Discount</p>
                                    <BiChevronDown  />
                                </button>
                            } triggerWhenOpen={
                                <button className='form--add'>
                                    <p style={{ fontSize: "1.14rem" }}>Add Discount</p>
                                    <BiChevronUp  />
                                </button>
                            }
                        >
                            <div className="form--item" style={{ marginTop: "1rem" }}>
                                <label className='form--label'>Discount ({currency})</label>
                                <CurrencyInputField name="discount" value={discount} setValue={setDiscount} shared={false} />
                            </div>
                        </CollapsibleDiv>
                    )}
                </div>

                <span className='actions' style={{ marginBottom: "1rem" }}>
                    <button onClick={handleDecrement} disabled={product?.hasVariation && !quantity}><BiMinus /></button>
                    <span className='value' style={{ fontSize: "1.4rem" }}>{quantity}</span>
                    <button onClick={handleIncrement} disabled={(product?.hasVariation && !quantity) || !inStock}><BiPlus /></button>
                </span>
            </figure>
        </React.Fragment>
    )
}