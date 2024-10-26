import React from 'react';
import { formatNumber, truncateString } from '../utils/helper';
import { RiDeleteBin5Line, RiEdit2Line } from 'react-icons/ri';
import { useWindowSize } from 'react-use';
import { Link } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL;

function ProductCard({ product }) {
    const { width } = useWindowSize();

    return (
        <figure className="product__figure">
            <Link to={`/dashboard/products/${product.productId}`} className="product__figure--img">
                <span className={`product__figure--stat status status--${(product.status)}`}>
                    <p style={{ minWidth: "0" }}>{product.status}</p>
                </span>
                <img src={BASE_URL + product?.images[0]} />
            </Link>

            <figcaption className="product__details">
                <Link to={`/dashboard/products/${product._id}`} className="">
                    <span className="product__figure--name">
                        {truncateString(product?.name, width < 400 ? 25 : 18)}
                    </span>
                    <p className='product__figure--collection'>{product?.productCollection}</p>
                    <p className='product__figure--price value'>₦{formatNumber(product.price)}</p>
                </Link>

                <div className="product__figure--details">
                    <p>Variations<span className='value'>{product?.variations.length}</span></p>
                    <p>Stock Amount<span className='value'>{product?.stockAmount}</span></p>
                </div>

                <span className='product__figure--actions'>
                    <button className='table--btn'><RiEdit2Line />{width > 500 ? "Edit" : ""}</button>
                    <button className='table--btn'><RiDeleteBin5Line />{width > 500 ? "Delete" : ""}</button>
                </span>

            </figcaption>
        </figure>
    )
}

export default ProductCard