import React, { useEffect, useState } from 'react'
import { useFetchedContext } from '../../../context/FetchedContext';
import { useNavigate, useParams } from 'react-router-dom';
import { GoDotFill } from 'react-icons/go';
import Spinner from '../../../components/spinner/mainSpinner';
import CustomAlert from '../../../components/layout/CustomAlert';
import BackButton from '../../../components/button/BackButton';
import { TbCashRegister } from 'react-icons/tb';
import { formatDateSince, formatNumber, truncateString } from '../../../utils/helper';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { BiChevronDown } from 'react-icons/bi';
import Line from '../../../components/elements/Line';
import { useAuthContext } from '../../../context/AuthContext';
import ColorBox from '../../../components/elements/ColorBox';
import { useWindowSize } from 'react-use';


function ProductItem() {
    const title = "product"
    const { id } = useParams();
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { currency } = useAuthContext();
    const { handleFetchOneItem } = useFetchedContext();
    
    ////////////////////////////////////////////////////
    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState({ status: null, message: null });
    const [error, setError] = useState(false);
    const [item, setItem] = useState(null);
    ////////////////////////////////////////////////////

    const colors = item?.variations?.filter(variant => variant.type.toLowerCase() === 'color');
    const sizes = item?.variations?.filter(variant => variant.type.toLowerCase() !== 'color');


    const getItem = async function () {
        try {
            const data = await handleFetchOneItem(title, id);
            if (!data) throw new Error("Connection Error");
            setItem(data)
        } catch (err) {
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(function() {
        window.scrollTo(0, 0);
        document.title = `Quicka | Product Item: #${item?.productId}`;
    }, [item]);

    
    useEffect(function () {
        getItem();
    }, [id])


    const PageTitle = function () {
        return (
            <React.Fragment>
                {item?.name}
                <span className={`status status--${(item?.status)}`}>
                    <p><GoDotFill />{item?.status}</p>
                </span>
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            {(response.message || response.status) && (
                <CustomAlert type={response.status} message={response.message} />
            )}

            
            
            {(loading && !item) ? (
                <Spinner />
            ) : (
                <div className='item__preview--section'>
                    <div className='page__section--heading' style={{ alignItems: "flex-start" }}>
                        <div className="heading--col">
                            <span style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                                <BackButton close={() => navigate(-1)} />

                                <div className="heading--row" style={{ flexWrap: "wrap" }}>
                                    <h2 className="page__section--title">
                                        Product Details - {id}
                                    </h2>

                                    {width > 850 && (
                                        <span className={`status status--${item?.status}`}>
                                            <p style={{ textTransform: "capitalize" }}><GoDotFill /> {item?.status}</p>
                                        </span>
                                    )}
                                </div>
                            </span>

                            {width <= 850 && (
                                <div className="heading--row" style={{ flexWrap: "wrap" }}>
                                    <span className={`status status--${item?.status}`}>
                                        <p style={{ textTransform: "capitalize" }}><GoDotFill /> {item?.status}</p>
                                    </span>
                                </div>
                            )}

                            <p style={{ fontSize: "1.28rem", padding: "0", textTransform: "none" }} className='preview--body-item'>
                                Created, {formatDateSince(item?.createdAt)}
                            </p>
                        </div>

                        <span className='page__section--btns'>
                            <button className="page__section-top-btn" onClick={() => {}} style={{ fontWeight: "600", color: "#444" }}>
                                Delete <RiDeleteBin5Line size={20} />
                            </button>
                            <span className="page__section--action" onMouseLeave={() => {}}>
                                <button onClick={() => {}} className="page__section-top-btn more">More Actions <BiChevronDown /></button>
                            </span>
                        </span>
                    </div>

                    <div className="item__preview--grid grid--1-6x1">
                        <div className="left--side">
                            <div className="card form">
                                <div className="section--heading">
                                    <h2>Product Information</h2>
                                </div>

                                <div className="item__preview--summary product">
                                    <div className='preview--body-item'>Product Id <span className='preview--body-value'>{id}</span></div>
                                    <div className='preview--body-item'>Product Name <span className='preview--body-value'>{item?.name}</span></div>
                                    <div className='preview--body-item'>Status <span className={`status status--${item?.status}`}><p><GoDotFill /> {item?.status}</p></span></div>
                                    <div className='preview--body-item'>Collection(s) <span className='preview--body-value'>{
                                        item?.product_collection?.map((collection, i) => (
                                            <p className='product__figure--collection' key={i}>{collection?.name}</p>
                                        ))
                                    }</span></div>
                                    <div className='preview--body-item'>Short Description <span className='preview--body-value'>{item?.shortDescription || "--"}</span></div>
                                    <div className='preview--body-item'>Main Description <div className='preview--body-value' style={{ color: "#444" }} dangerouslySetInnerHTML={{ __html: truncateString(item?.description, 400) }} /></div>
                                    <div className='preview--body-item'>Product Price <span className='preview--body-value value'>{currency}{formatNumber(item?.price)}</span></div>
                                    <div className='preview--body-item'>Stock 
                                        {item?.trackInventory ? (
                                            <span className='preview--body-value value'>{formatNumber(item?.stockAmount)}</span>
                                        ) : (
                                            <span className='preview--body-value'>"Inventory not tracked"</span>
                                        )}
                                    </div>
                                    <div className='preview--body-item'>Product Unit <span className='preview--body-value'>{item?.unit || "--"}</span></div>
                                    <div className='preview--body-item'>Discount <span className='preview--body-value value'>{item?.discount?.discountValueInFigure}</span></div>
                                    <div className='preview--body-item'>Already Sold <span className='preview--body-value'>{item?.soldAmount || "None"}</span></div>

                                    <div className='preview--body-item'>Variations 
                                        <span className='preview--body-value'>
                                            {colors && colors.length > 0 && (
                                                <span style={{ display: "flex", alignItems: "center", gap: ".48rem" }}>
                                                    Color(s): {colors.map(color => <ColorBox color={color.value} />)}
                                                </span>
                                            )}
                                            {sizes && sizes.length > 0 && (
                                                <span style={{ display: "flex", alignItems: "center", gap: ".48rem" }}>
                                                    Size(s): {sizes.map(size => size.value).join(', ')}
                                                </span>
                                            )}
                                        </span>
                                    </div>

                                </div>
                            </div>
                        </div>


                        <div className="right--side">
                            <div className="card form">
                                <div className="section--heading">
                                    <h2 style={{ textTransform: "none" }}>Product Image(s)</h2>
                                </div>
                            
                                <div className="item__preview--images"> 
                                    <img src={item?.images?.[0]?.url} alt={item?.name + " - 1"} /> 
                                    {item?.images?.length > 1 && (
                                        <span className="images--img"> 
                                            {item?.images?.slice(1).map((img, i) => (
                                                <img src={img?.url} alt={`${item?.name} - ${i + 1}`} />
                                            ))}
                                        </span>
                                    )}
                                </div>


                            </div>
                        </div>
                    </div>

                </div>
            )}
           

        </React.Fragment>
    )
}

export default ProductItem