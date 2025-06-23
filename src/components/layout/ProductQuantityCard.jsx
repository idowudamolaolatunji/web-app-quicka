import React, { useEffect, useState } from 'react'
import { BiChevronDown, BiChevronUp, BiMinus, BiPlus } from 'react-icons/bi'
import { AiOutlineClose } from 'react-icons/ai';
import { formatNumber, truncateString } from '../../utils/helper';
import { useAuthContext } from '../../context/AuthContext';
import CurrencyInputField from '../form/CurrencyInputField';
import CollapsibleDiv from 'react-collapsible';



function ProductQuantityCard({ product, quantity, onQuantityChange, removeItem, discount, setDiscount }) {
    const { currency } = useAuthContext();
    const inStock = product?.stockAmount && product?.stockAmount >= quantity;
    const [loader, setLoader] = useState(true);
    const [subTotal, setSubTotal] = useState(0);

    
    useEffect(function() {
        setTimeout(() => {
            setLoader(false)
        }, 1000);
    }, []);

    const handleIncrement = function() {
        if(inStock) {
            onQuantityChange(quantity + 1);
        }
    };
    
    const handleDecrement = function() {
        onQuantityChange(Math.max(quantity - 1, 1));
    };

    useEffect(function() {
        const productTotal = (product?.price * quantity);
        setSubTotal(productTotal - (discount || 0) )
    }, [quantity, discount])


  return (
    <figure className='product--quantity-figure'>
        <div className={`img-box ${(!inStock && !loader) ? "out-of-stock" : ""}`} style={{ height: "70%", overflow: "hidden" }}>
            <img src={product?.images[0]?.url} alt={product?.name} />
            <span onClick={() => removeItem(product._id)}><AiOutlineClose /></span>
        </div>

        <div className="product--quantity-details">
            <p className='title'>
                {truncateString(product?.name, 15)}
            </p>

            <span className='price'>
                {currency}
                <span className='value'>
                    {formatNumber(subTotal)}
                </span>
            </span>

            <CollapsibleDiv trigger={
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
        </div>

        <span className='actions'>
            <button onClick={handleDecrement}><BiMinus /></button>
            <span className='value' style={{ fontSize: "1.4rem" }}>{quantity}</span>
            <button disabled={!inStock} onClick={handleIncrement}><BiPlus /></button>
        </span>
    </figure>
  )
}

export default ProductQuantityCard