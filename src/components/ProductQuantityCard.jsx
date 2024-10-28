import React, { useEffect, useState } from 'react'
import { BiMinus, BiPlus } from 'react-icons/bi'
import Spinner from "../components/spinner/simple";
import { AiOutlineClose } from 'react-icons/ai';


const BASE_URL = import.meta.env.VITE_BASE_URL

function ProductQuantityCard({ product, quantity, onQuantityChange, removeItem }) {
    const inStock = product?.stockAmount > quantity;
    const [loader, setLoader] = useState(true);

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


  return (
    <figure className='product--quantity-figure'>
        <div className={`img-box ${(!inStock && !loader) ? "out-of-stock" : ""}`} style={{ height: "70%", overflow: "hidden" }}>
            <img src={`${BASE_URL}${product?.images[0]}`} alt={product?.name} />
            <span onClick={() => removeItem(product._id)}><AiOutlineClose /></span>
        </div>

        <span className='actions'>
            <button onClick={handleDecrement}><BiMinus /></button>
            <span className='value'>{quantity}</span>
            <button disabled={!inStock} onClick={handleIncrement}><BiPlus /></button>
        </span>
    </figure>
  )
}

export default ProductQuantityCard