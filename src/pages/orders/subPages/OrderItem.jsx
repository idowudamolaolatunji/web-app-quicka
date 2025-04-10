import React, { useEffect, useState } from 'react'
import { useFetchedContext } from '../../../context/FetchedContext';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../../components/button/BackButton';
import TooltipUI from '../../../components/layout/TooltipUI';
import { RiDeleteBin5Line, RiEdit2Line } from 'react-icons/ri';
import { formatDateSince, formatNumber } from '../../../utils/helper';
import { BiChevronDown } from 'react-icons/bi';
import ColorBox from '../../../components/elements/ColorBox';
import Line from '../../../components/elements/Line';
import { useWindowSize } from 'react-use';
import Spinner from '../../../components/spinner/mainSpinner';
import CustomAlert from '../../../components/layout/CustomAlert';
import Delete from '../../../components/modal/Delete';
import { GoDotFill } from 'react-icons/go';
import { TbCashRegister, TbTruckDelivery } from 'react-icons/tb';
import { BsCash } from 'react-icons/bs';
import { MdOutlinePendingActions } from 'react-icons/md';
import { LuPackageCheck } from 'react-icons/lu';
import { useAuthContext } from '../../../context/AuthContext';


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
    /*
        {
            _id: "67991948baf37f41eb865340",
            store: "6794dfc7a535c14711135078",
            products: [
                {
                    id: "6796e37935af332982842ed4",
                    name: "Nude Sunbo Slippers SS007 - Size 40",
                    quantity: 2,
                    price: 100000,
                    discount: 20000,
                    productId: "",
                    image: "https://res.cloudinary.com/du8iw1efa/image/upload/c_fill,g_auto,h_950,q_80,w_950/v1/products/product-1737963632418-2?_a=BAMCkGOY0",
                    product_collection: [ { name: "Sneakers" } ],
                    variations: [
                        { type: "Color", value: "Red" },
                        { type: "Size", value: "33" },
                    ],
                }
            ],
            customer: {
                contact: {
                    countryCode: "ng",
                    dialCode: "234",
                    phoneNumber: "9057643470",
                    phone: "2349057643470",
                    email: "damolaidowudavid@gmail.com"
                },
                shippingAddress: {
                    country: {
                        name: "Nigeria",
                        iso2: "NG"
                    }
                },
                _id: "6798ae6160c27aeb8a0c7252",
                firstname: "idowu",
                lastname: "olatunji",
                createdAt: "2025-01-28T10:16:01.208Z",
                fullname: "idowu olatunji"
            },
            description: "",
            orderSubTotal: 190000,
            orderDeliveryFee: 10000,
            orderTotalQuantity: 2,
            profit: 180000,
            orderDate: "2025-01-28T17:51:00.000Z",
            channel: "instagram",
            paymentStatus: "paid",
            paymentMethod: "cash",
            deliveryStatus: "delivered",
            orderStatus: "completed",
            createdAt: "2025-01-28T17:52:08.049Z",
            orderId: "#78080",
        }
    */


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
                                    {item?.products?.map(product => (
                                        <React.Fragment>
                                            <div className="item__preview--item">
                                                <img className="item--image" src={product?.image} alt={product?.name} />
                                                <div className="item--details">
                                                    {product?.product_collection?.map((collection, i) => (
                                                        <p className='product__figure--collection' key={i}>{collection}</p>
                                                    ))}
                                                    <h3 className='item--title'>{product?.name}</h3>
                                                </div>
                                            </div>

                                            <div className="item__preview--info">
                                                <p className='value'><input className='form--input' value={product?.quantity} /> x {currency}{formatNumber(product?.price)}</p>
                                                <span className='preview--body-item' style={{ border: "none", padding: 0 }}>Sub total</span>
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

                                <div className="item__preview--item">

                                </div>
                            </div>
                        </div>


                        <div className="right--side">
                            <div className="card">
                                <div className="section--heading">
                                    <h2>Customer information</h2>
                                    <Line border={1.4} where="Top" value="1rem" />
                                </div>

                            </div>


                            <div className="card">
                                <div className="section--heading">
                                    <h2>Payment Summary</h2>
                                    <Line border={1.4} where="Top" value="1rem" />
                                </div>

                            </div>


                            <div className="card">
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