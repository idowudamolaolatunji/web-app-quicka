import React from 'react';
import { formatNumber, truncateString } from '../../utils/helper';
import { RiDeleteBin5Line, RiEdit2Line } from 'react-icons/ri';
import { useWindowSize } from 'react-use';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import empty_product from "../../assets/images/dummy_items/empty_product.png";
import { BiCartAlt, BiShoppingBag } from 'react-icons/bi';


// PRODUCT IS THE PRODUCT OBJECT PASSED INTO THIS COMPONENT TO SHOW CASE, OPEN IS WHERE TO OPEN TO A FUNCTION AT THAT AND FINALLY, FORTEMPLATE IS A BOOLEAN THAT TELLS US IF THIS IS FOR A TEMPLATE CARD SHOWCASE
function ProductCard({ product, open, forTemplate }) {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { store } = useAuthContext();
    const currency = store?.currency?.symbol;

    return (
        <React.Fragment>
            {forTemplate ? (
                <figure className="product__figure">
                    <div className="product__figure--img">
                        <img src={forTemplate ? product?.images?.at(0) : empty_product} />
                    </div>

                    <figcaption className="product__details" style={{ padding: "1rem 2rem" }}>
                        <div>
                            <span className="product__figure--name">
                                {truncateString(product?.name, width < 400 ? 25 : 18)}
                            </span>
                            
                            <p className='product__figure--price value'>{currency}{formatNumber(product?.price)}</p>
                        </div>

                        <span className='product__figure--actions'>
                            <button className='table--btn'><BiCartAlt />Add to cart</button>
                            <button className='table--btn'><BiShoppingBag />Buy now</button>
                        </span>
                    </figcaption>
                </figure>
            ) : (
                <figure className="product__figure display--product">
                    <Link to={`/dashboard/products/${product?.productId}`} className="product__figure--img">
                        <span className={`product__figure--stat status status--${(product?.status)}`}>
                            <p style={{ minWidth: "0" }}>
                                {product?.status}
                            </p>
                        </span>
                        <img src={(!forTemplate && product?.images?.length > 0) ? product?.images?.at(0)?.url : empty_product} />
                    </Link>

                    <figcaption className="product__details">
                        <Link to={`/dashboard/products/${product?.productId}`} className="">
                            <span className="product__figure--name">
                                {truncateString(product?.name, width < 400 ? 25 : 18)}
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
                                {product?.product_collection?.slice(0, width < 600 ? 2 : 3)?.map((collection, i) => (
                                    <p className='product__figure--collection' key={i}>{collection?.name}</p>
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
            )}
        </React.Fragment>
    )
}

export default ProductCard