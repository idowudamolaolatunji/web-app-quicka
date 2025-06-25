import React from 'react'
import { formatNumber, truncateString } from '../../utils/helper'
import { AiOutlineClose } from 'react-icons/ai'
import { useAuthContext } from '../../context/AuthContext';
import { useWindowSize } from 'react-use';

function ProductPreview({ product, removeItem }) {
    const { width } = useWindowSize();
    const { currency } = useAuthContext();


  return (
    <figure className='product--quantity-figure'>
            <div className="img-box" style={{ height: "70%", overflow: "hidden" }}>
                <img src={product?.mainImageUrl} alt={product?.name} />
                {removeItem && (
                    <span onClick={() => removeItem(product._id)}><AiOutlineClose /></span>
                )}
            </div>
    
            <div className="product--quantity-details">
                <p className='title'>
                    {truncateString(product?.name, width < 400 ? 10 : 13)}
                </p>
    
                <span className='price'>
                    {currency}
                    <span className='value'>
                        {formatNumber(product?.price)}
                    </span>
                </span>
            </div>

        </figure>
  )
}

export default ProductPreview
