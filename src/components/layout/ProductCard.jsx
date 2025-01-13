import React from 'react';
import { formatNumber, truncateString } from '../../utils/helper';
import { RiDeleteBin5Line, RiEdit2Line } from 'react-icons/ri';
import { useWindowSize } from 'react-use';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import empty_product from "../../assets/images/dummy_items/empty_product.png";


function ProductCard({ product, open, base }) {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { store } = useAuthContext();
    const { currencies, mainCurrency } = store;
    const currency = currencies[mainCurrency]?.symbol;

    return (
        <figure className="product__figure">
            <Link to={base != "dummy" && `/dashboard/products/${product?.productId}`} className="product__figure--img">
                <span className={`product__figure--stat status status--${(product?.status)}`}>
                    <p style={{ minWidth: "0" }}>{product?.status}</p>
                </span>
                <img src={(base != "dummy" && product?.images?.length > 0) ? product?.images?.at(0)?.url : (base == "dummy") ? product?.images?.at(0) : empty_product} />
            </Link>

            <figcaption className="product__details">
                <Link to={`/dashboard/products/${product?.productId}`} className="">
                    <span className="product__figure--name">
                        {truncateString(product?.name, width < 400 ? 25 : 18)}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
                        {product?.productCollection?.slice(0, width < 600 ? 2 : 3)?.map((collection) => (
                            <p className='product__figure--collection'>{collection}</p>
                        ))}
                    </span>
                    
                    <p className='product__figure--price value'>{currency}{formatNumber(product?.price)}</p>
                </Link>

                {product?.trackInventory ? (  
                    <div className="product__figure--details">
                        <p>Variations<span className='value'>{product?.variations.length}</span></p>
                        <p>Stock Amount<span className='value'>{product?.stockAmount}</span></p>
                    </div>
                ) : (
                    <div className="product__figure--details" style={{ color: "red", fontWeight: "500" }}>
                        Inventory not tracked
                    </div>
                )}

                <span className='product__figure--actions'>
                    <button className='table--btn' onClick={() => navigate(`${product?.productId}/edit`)}><RiEdit2Line />{width > 500 ? "Edit" : ""}</button>
                    <button className='table--btn' onClick={() => open(product?._id)}><RiDeleteBin5Line />{width > 500 ? "Delete" : ""}</button>
                </span>

            </figcaption>
        </figure>
    )
}

export default ProductCard