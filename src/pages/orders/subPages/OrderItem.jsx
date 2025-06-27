import React, { useEffect, useState } from 'react'
import { useFetchedContext } from '../../../context/FetchedContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../../components/button/BackButton';
import TooltipUI from '../../../components/layout/TooltipUI';
import { RiDeleteBin5Line, RiEdit2Line } from 'react-icons/ri';
import { formatDateSince, formatNumber } from '../../../utils/helper';
import { BiChevronDown, BiMapPin } from 'react-icons/bi';
import { ColorBox } from '../../../components/elements/ColorBox';
import Line from '../../../components/elements/Line';
import { useWindowSize } from 'react-use';
import Spinner from '../../../components/spinner/MainSpinner';
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
import ErrorComponent from '../../../components/layout/ErrorComponent';
import { AiOutlinePlus } from 'react-icons/ai';
import MainDropdownSelect from '../../../components/form/MainDropdownSelect';
import Info from '../../../components/elements/Info';
import { selectCustomer } from '../../../utils/fetch';


function OrderItem() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currency, headers } = useAuthContext();
    const { customers, handleFetchOneItem, handleDeleteOneItem, handleFetchMyStoreOrders, handleFetchMyStoreTransactions } = useFetchedContext();

    ////////////////////////////////////////////////////
    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState({ status: null, message: null });
    const [error, setError] = useState(false);
    const [item, setItem] = useState(null);
    ////////////////////////////////////////////////////
    const [orderCustomer, setOrderCustomer] = useState([]);
    const [showModal, setShowModal] = useState({ delete: false, customer: false });
    const [addCustomer, setAddCustomer] = useState(false);

    useEffect(function() {
        console.log(orderCustomer)
    }, [orderCustomer])

    const getItem = async function () {
        setItem(null);
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
    }, [])

    useEffect(function() {
        document.title = `Quicka - Order Details: ${item?.orderId || "Loading.."} | Business Management Tool for SME's`;
    }, [item]);

    useEffect(function () {
        setLoading(true);
        getItem();
    }, [id]);


    const handleAddCustomer = async function() {
        const result = await selectCustomer(item?._id, headers, orderCustomer[0]?._id);
        if(result == "success") {
            setItem({ ...item, customer: orderCustomer[0] });
            handleFetchMyStoreOrders();
        }
    }

    // DELETE FUNCTION
    async function deleteItem() {
        try {
            setLoading(true)
            await handleDeleteOneItem(`orders/${item?._id}`);
            setResponse({ message: "Successful!", response: "success" })
            handleFetchMyStoreOrders();
            handleFetchMyStoreTransactions()
            
            setTimeout(function() {
                navigate(-1)
                setShowModal({ ...showModal, delete: false });
            }, 1000)
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }


    if(!item && error) {
        return (
            <div style={{ height: "28rem" }} className='flex-align-center'>
                <ErrorComponent />
            </div>
        )
    }

    return (
        <React.Fragment>
            {showModal.delete && (
                <Delete 
                    title={`"Order"`}
                    close={() => setShowModal({ ...showModal, delete: false })} 
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
                                        Order ID: #
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
                            <button className="page__section-top-btn" onClick={() => setShowModal({ ...showModal, delete: true })} style={{ fontWeight: "600", color: "#444" }}>
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
                                            <Link className="item__preview--item" to={`/dashboard/products/${product?.productId}`}>
                                                <img className="item--image" src={product?.image} alt={product?.name} />
                                                <div className="item--details">
                                                    {product?.product_collection?.map((collection, i) => (
                                                        <p className='product__figure--collection' key={i}>{collection}</p>
                                                    ))}
                                                    <h3 className='item--title'>{product?.name}</h3>
                                                    <p className='flex align'><span className="preview--body-item">Quality - </span> <span className="value" style={{ fontSize: "1.4rem" }}>{product?.quantity}</span></p>
                                                </div>
                                            </Link>

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
                                    <div className='preview--body-item' style={{ marginBottom: "-.48rem" }}>
                                        Sales Channel 
                                        <span className='preview--body-value flex' style={{ flexDirection: "row", gap: ".68rem", textTransform: "capitalize", alignItems: "center" }}>
                                            {item?.channel} <img style={{ width: "2.4rem" }} alt={item?.channel} src={imgString(item?.channel)} />
                                        </span>
                                    </div>
                                    <div className='preview--body-item'><span>Product{item?.products?.length > 1 ? "s" : ""} Price <span className='value'>* {item?.orderTotalQuantity}</span></span><span className='preview--body-value value'>{currency}{formatNumber(item?.profit + item?.orderDiscountAmount)}</span></div>
                                    <div className='preview--body-item'>Order Discount <span className='preview--body-value value'>{item?.orderDiscountAmount ? `-${currency}${formatNumber(item?.orderDiscountAmount)}` : "--"}</span></div>
                                    <div className='preview--body-item'>Delivery Fee <span className='preview--body-value value'>{item?.orderDeliveryFee ? `${currency}${formatNumber(item?.orderDeliveryFee)}` : "--"}</span></div>
                                    <div className='preview--body-item'>Total Paid <span className='preview--body-value value'>{currency}{formatNumber(item?.orderSubTotal)}</span></div>
                                    <div className='preview--body-item'>Sales Profit <span className='preview--body-value value'>{currency}{formatNumber(item?.profit)}</span></div>
                                </div>
                            </div>
                        </div>


                        <div className="right--side">
                            <div className="card form">
                                <div className="section--heading">
                                    <h2>Addition Note</h2>
                                    <Line border={1.4} where="Top" value="1rem" />
                                </div>
                            
                                {(item?.description) ? (
                                    <p style={{ fontSize: "1.4rem" }} dangerouslySetInnerHTML={{ __html: item?.description }}></p>
                                ) : (
                                    <p className='preview--body-item' style={{ padding: 0 }}>None Added</p>
                                )}
                            </div>
                                

                            <div className="card form">
                                <div className="section--heading">
                                    <h2>Customer information</h2>
                                    <Line border={1.4} where="Top" value="1rem" />
                                </div>

                                <div className="item__preview--customer">
                                    <span className="item--box" onClick={() => item?.customer?._id ? navigate(`/dashboard/customers/${item?.customer?._id}`) : ""}>
                                        <div className='table-customer'>
                                            {item?.customer?.image?.url ? (
                                                <img src={item?.customer?.image?.url} />
                                            ) : (
                                                <HiOutlineUser />
                                            )}
                                        </div>
                                        <p className="box--text" style={{ textTransform: "capitalize" }}>{item?.customer?.fullname || "None Selected"}</p>
                                    </span>

                                    {item?.customer?._id ? (
                                        <React.Fragment>
                                            <span className="item--box">
                                                <span className="box--icon"><HiOutlinePhone /></span>
                                                <p className="box--text value" style={{ fontSize: "1.2rem" }}>+{item?.customer?.contact?.phone}</p>
                                            </span>
                                            <span className="item--box">
                                                <span className="box--icon"><HiOutlineEnvelope /></span>
                                                <p className="box--text">{item?.customer?.contact?.email}</p>
                                            </span>
                                            <span className="item--box">
                                                <span className="box--icon" style={{ width: "2.8rem" }}><PiMapPinArea /></span>
                                                <p className="box--text">{item?.customer?.shippingAddress?.address || "Address not selected"}</p>
                                            </span>
                                            <span className="item--box">
                                                <span className="box--icon"><MdWhatsapp /></span>
                                                <a className="box--text link" target='_blank' href={`https://wa.me/${item?.customer?.contact?.phone}`}>Message via whatsapp</a>
                                            </span>
                                        </React.Fragment>
                                    ) : (
                                        <React.Fragment>
                                            {!addCustomer ? (
                                                <button className='form--add' style={{ alignSelf: "flex-start" }} onClick={() => setAddCustomer(true)}>
                                                    <AiOutlinePlus />
                                                    <p>Select Customer</p>
                                                </button>
                                            ) : (
                                                <div className="form--item">
                                                    <MainDropdownSelect title="Customer" options={customers} field="fullname" value={orderCustomer} setValue={setOrderCustomer} noDataLabel='No customer found!' />
                                                    <Info text="If you don't have customer's details, Leave blank" />
                                                    <div className="flex-align-center">
                                                        <button className='form--add' style={{ alignSelf: "flex-end" }} onClick={() => setShowModal({ ...showModal, customer: true })}>
                                                            <AiOutlinePlus />
                                                            <p>New Customer</p>
                                                        </button>
                                                        <button className='general--btn' onClick={() => orderCustomer.length > 0 ? 
                                                            handleAddCustomer()
                                                            : setAddCustomer(false)}>
                                                            {orderCustomer.length > 0 ? "Save" : 'Cancel'}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </React.Fragment>
                                    )}
                                </div>
                            </div>

                            <div className="card form">
                                <div className="section--heading">
                                    <h2>Payment Summary</h2>
                                    <Line border={1.4} where="Top" value="1rem" />
                                </div>

                                <div className="item__preview--summary">
                                    <div className='preview--body-item'>Amount Paid <span className='preview--body-value value'>{currency}{formatNumber(item?.profit)}</span></div>
                                    <div className='preview--body-item'>Payment Status <span className={`status status--${item?.paymentStatus}`}><p><GoDotFill /> {item?.paymentStatus}</p></span></div>
                                    <div className='preview--body-item'>
                                        Payment Method
                                        {item?.paymentMethod ? (
                                            <span className={`status status--pending`}><p><TbCashRegister /> {String(item?.paymentMethod).replace("-", " ")}</p></span>
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