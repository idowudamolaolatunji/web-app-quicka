import React, { useEffect, useState } from 'react'
import { useFetchedContext } from '../../../context/FetchedContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../../components/button/BackButton';
import TooltipUI from '../../../components/layout/TooltipUI';
import { RiDeleteBin5Line, RiEdit2Line } from 'react-icons/ri';
import { formatDateSince, formatNumber } from '../../../utils/helper';
import { BiChevronDown, BiMapPin } from 'react-icons/bi';
import ColorBox from '../../../components/elements/ColorBox';
import Line from '../../../components/elements/Line';
import { useWindowSize } from 'react-use';
import Spinner from '../../../components/spinner/mainSpinner';
import CustomAlert from '../../../components/layout/CustomAlert';
import Delete from '../../../components/modal/Delete';
import { TbCashRegister, TbTruckDelivery } from 'react-icons/tb';
import { MdOutlinePendingActions, MdWhatsapp } from 'react-icons/md';
import { LuPackageCheck } from 'react-icons/lu';
import { useAuthContext } from '../../../context/AuthContext';
import { HiOutlineEnvelope, HiOutlinePhone, HiOutlineUser } from 'react-icons/hi2';
import { PiMapPinArea } from "react-icons/pi";
import { GoDotFill } from 'react-icons/go';
import { imgString } from '../../../assets/images/png_elements';


function OrderItem() {
    const { id } = useParams();
    const { width } = useWindowSize();
    const navigate = useNavigate();
    const { currency } = useAuthContext();
    const { handleFetchOneItem,
        handleDeleteOneItem,
        handleFetchMyStoreOrders,
            handleFetchMyStoreProducts,
            handleFetchMyStoreTransactions,
     } = useFetchedContext();
    ////////////////////////////////////////////////////
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState({ status: null, message: null });
    const [error, setError] = useState(false);
    const [item, setItem] = useState(null);
    ////////////////////////////////////////////////////


    const getItem = async function () {
        setError(false);
        try {
            const data = await handleFetchOneItem("order", id);
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
        document.title = `Quicka | Order Id: ${item?.map}`;
    }, [item]);

    useEffect(function () {
        getItem();
    }, [id]);


    // DELETE FUNCTION
    async function deleteItem() {
        try {
            setLoading(true)
            await handleDeleteOneItem(`orders`, item?._id);
            setResponse({ message: "Successful!", response: "success" })

            handleFetchMyStoreOrders();
            handleFetchMyStoreProducts();
            handleFetchMyStoreTransactions();
            
            setTimeout(function() {
                navigate(-1)
                setShowDeleteModal(false);
            }, 1000)
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }


    return (
        <React.Fragment>
            {showDeleteModal && (
                <Delete 
                    title={`"Order"`}
                    close={setShowDeleteModal} 
                    fn={deleteItem}
                />
            )}
            
            {(response.message || response.status) && (
                <CustomAlert type={response.status} message={response.message} />
            )}

            {(loading && !item) ? (
                <Spinner />
            ) : (
                <div className='item__preview--section'>
                    <div className='page__section--heading' style={{ alignItems: "flex-start" }}>
                        <div className="heading--col">
                            <span style={{ display: "flex", gap: "1rem" }}>
                                <BackButton close={() => navigate(-1)} />

                                <div className="heading--row">
                                    <h2 className="page__section--title">
                                        Order Id:
                                        <span className="value" style={{ fontSize: "2rem" }}>{item?.orderId}</span>
                                    </h2>
                                </div>
                            </span>

                            <div className="heading--row">
                                <span className={`status status--${item?.paymentStatus}`}>
                                    <p><TbCashRegister /> {item?.paymentStatus}</p>
                                </span>
                                <span className={`status status--${item?.deliveryStatus}`}>
                                    <p><TbTruckDelivery style={{ fontSize: "1.8rem" }} /> {item?.deliveryStatus}</p>
                                </span>
                                <span className={`status status--${item?.orderStatus}`}>
                                    <p>
                                        {item?.orderStatus == "processing" ? <MdOutlinePendingActions /> : <LuPackageCheck />}
                                        {item?.orderStatus}
                                    </p>
                                </span>
                            </div>

                            <p style={{ fontSize: "1.28rem", padding: "0", textTransform: "none" }} className='preview--body-item'>
                                Ordered item{item?.products?.length > 1 ? "s" : ""}, {formatDateSince(item?.orderDate)}
                            </p>
                        </div>

                        <span className='page__section--btns'>
                            <button className="page__section-top-btn" onClick={() => setShowDeleteModal(true)} style={{ fontWeight: "600", color: "#444" }}>
                                Delete <RiDeleteBin5Line size={20} />
                            </button>
                            <span className="page__section--action" onMouseLeave={() => {}}>
                                <button onClick={() => {}} className="page__section-top-btn more">More Actions <BiChevronDown /></button>
                            </span>
                        </span>
                    </div>

                    <div className="item__preview--grid grid--2x1">
                        <div className="left--side">
                            <div className="card form">
                                <div className="section--heading">
                                    <h2>Order Item (<span className='value'>{item?.products?.length}</span>)</h2>
                                    <Line border={1.4} where="Top" value="1rem" />
                                </div>

                                <div className="item__preview--grid grid--2x1" style={{ alignItems: "center" }}>
                                    {item?.products?.map((product, i) => (
                                        <React.Fragment>
                                            <div className="item__preview--item">
                                                <img className="item--image" src={product?.image} alt={product?.name} />
                                                <div className="item--details">
                                                    {product?.product_collection?.map((collection, i) => (
                                                        <p className='product__figure--collection' key={i}>{collection}</p>
                                                    ))}
                                                    <h3 className='item--title'>{product?.name}</h3>
                                                    <p className='flex align'><span className="preview--body-item">Quality - </span> <span className="value" style={{ fontSize: "1.4rem" }}>{product?.quantity}</span></p>
                                                </div>
                                            </div>

                                            <div className="item__preview--info">
                                                <p className='value'><input className='form--input' value={product?.quantity} /> x {currency}{formatNumber(product?.price)}</p>
                                                <span className='preview--body-item'>Sub total</span>
                                                <p className='value'>₦{formatNumber(product?.quantity * product?.price)}</p>
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>

                            <div className="card form">
                                <div className="section--heading">
                                    <h2>Order Summary</h2>
                                    <Line border={1.4} where="Top" value="1rem" />
                                </div>
                                
                                <div className="item__preview--summary order">
                                    <div className='preview--body-item' style={{ marginTop: "-.8rem" }}>
                                        Sales Channel 
                                        <span className='preview--body-value flex' style={{ flexDirection: "row", gap: ".68rem", textTransform: "capitalize" }}>
                                        {item?.channel} <img style={{ width: "2.8rem" }} alt={item?.channel} src={imgString(item?.channel)} />
                                        </span>
                                    </div>
                                    <div className='preview--body-item'><span>Item Price <span className='value'>x {item?.orderTotalQuantity}</span></span><span className='preview--body-value value'>{currency}{formatNumber(item?.profit)}</span></div>
                                    <div className='preview--body-item'>Order Discount <span className='preview--body-value value'>{item?.orderDiscountAmount ? `-${currency}${formatNumber(item?.orderDiscountAmount)}` : "--"}</span></div>
                                    <div className='preview--body-item'>Delivery Fee <span className='preview--body-value value'>{item?.orderDeliveryFee ? `${currency}${formatNumber(item?.orderDeliveryFee)}` : "--"}</span></div>
                                    <div className='preview--body-item'>Total Paid <span className='preview--body-value value'>{currency}{formatNumber(item?.orderSubTotal)}</span></div>
                                    <div className='preview--body-item'>My Profit <span className='preview--body-value value'>{currency}{formatNumber(item?.profit)}</span></div>
                                </div>
                            </div>
                        </div>


                        <div className="right--side">
                            <div className="card form">
                                <div className="section--heading">
                                    <h2>Customer information</h2>
                                    <Line border={1.4} where="Top" value="1rem" />
                                </div>

                                <div className="item__preview--customer">
                                    <span className="item--box" onClick={() => navigate(`/dashboard/customers/${item?.customer?._id}`)}>
                                        <div className='table-customer'>
                                            {item?.customer?.image?.url ? (
                                                <img src={item?.customer?.image?.url} />
                                            ) : (
                                                <HiOutlineUser />
                                            )}
                                        </div>
                                        <p className="box--text" style={{ textTransform: "capitalize" }}>{item?.customer?.fullname}</p>
                                    </span>

                                    <span className="item--box">
                                        <span className="box--icon"><HiOutlinePhone /></span>
                                        <p className="box--text value" style={{ fontSize: "1.2rem" }}>+{item?.customer?.contact?.phone}</p>
                                    </span>
                                    <span className="item--box" onclick="window.location.href='mailto:user@example.com'">
                                        <span className="box--icon"><HiOutlineEnvelope /></span>
                                        <p className="box--text">{item?.customer?.contact?.email}</p>
                                    </span>
                                    <span className="item--box">
                                        <span className="box--icon" style={{ width: "3rem" }}><PiMapPinArea /></span>
                                        <p className="box--text">{item?.customer?.shippingAddress?.address}</p>
                                    </span>
                                    <span className="item--box">
                                        <span className="box--icon"><MdWhatsapp /></span>
                                        <a className="box--text link" target='_blank' href={`https://wa.me/${item?.customer?.contact?.phone}`}>Message via whatsapp</a>
                                    </span>
                                </div>
                            </div>


                            <div className="card form">
                                <div className="section--heading">
                                    <h2>Payment Summary</h2>
                                    <Line border={1.4} where="Top" value="1rem" />
                                </div>

                                <div className="item__preview--summary payment">
                                    <div className='preview--body-item'>Amount Paid <span className='preview--body-value value'>{currency}{formatNumber(item?.profit)}</span></div>
                                    <div className='preview--body-item'>Payment Status <span className={`status status--${item?.paymentStatus}`}><p><GoDotFill /> {item?.paymentStatus}</p></span></div>
                                    <div className='preview--body-item'>
                                        Payment Method
                                        {item?.paymentMethod ? (
                                            <span className={`status status--pending`}><p><GoDotFill /> {String(item?.paymentMethod).replace("-", " ")}</p></span>
                                        ) : (
                                            <span className={`status status--draft`}><p><GoDotFill /> none</p></span>
                                        )}
                                    </div>
                                </div>
                            </div>


                            <div className="card form">
                                <div className="section--heading">
                                    <h2>Delivery Details</h2>
                                    <Line border={1.4} where="Top" value="1rem" />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    )
}

export default OrderItem