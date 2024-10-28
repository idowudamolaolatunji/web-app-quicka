import React from 'react'
import { BiMinus, BiPlus } from 'react-icons/bi'


const BASE_URL = import.meta.env.VITE_BASE_URL

function ProductQuantityCard({ product, quantity, onQuantityChange }) {
    const inStock = product?.stockAmount > quantity;

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
        <div className={!inStock ? "out-of-stock" : ""} style={{ height: "70%", overflow: "hidden" }}>
            <img src={`${BASE_URL}${product?.images[0]}`} alt={product?.name} />
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