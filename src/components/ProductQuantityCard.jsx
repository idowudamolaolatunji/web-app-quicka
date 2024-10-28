import React from 'react'
import { BiMinus, BiPlus } from 'react-icons/bi'


const BASE_URL = import.meta.env.VITE_BASE_URL

function ProductQuantityCard({ product, handleQuantity }) {


  return (
    <figure className='product--quantity-figure'>
        <img src={`${BASE_URL}${product?.images[0]}`} alt={product?.name} />
        <span className='actions'>
            <button><BiMinus /></button>
            <span>1</span>
            <button><BiPlus /></button>
        </span>
    </figure>
  )
}

export default ProductQuantityCard