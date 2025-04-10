import React, { useEffect, useState } from 'react'
import { useFetchedContext } from '../../../context/FetchedContext';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../../components/button/BackButton';
import TooltipUI from '../../../components/layout/TooltipUI';
import { RiDeleteBin5Line, RiEdit2Line } from 'react-icons/ri';
import { formatDateSince } from '../../../utils/helper';
import { BiChevronDown } from 'react-icons/bi';
import ColorBox from '../../../components/elements/ColorBox';
import Line from '../../../components/elements/Line';
import { useWindowSize } from 'react-use';
import { SiUber } from 'react-icons/si';
import Spinner from '../../../components/spinner/mainSpinner';


function OrderItem() {
    const { id } = useParams();
    const { width } = useWindowSize();
    const navigate = useNavigate();
    const { handleFetchOneItem } = useFetchedContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [item, setItem] = useState(null
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
    );
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

    return (
        <>
            {loading && <Spinner />}

            <div className='item__preview--section'>
                <div className='page__section--heading' style={{  alignItems: "flex-start" }}>
                    <span style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                        <BackButton close={() => navigate(-1)} />

                        <div className="heading--col">
                            <div className="heading--row" style={{ flexWrap: "wrap" }}>
                                <h2 className="page__section--title">
                                    Order Id:
                                    <span className="value" style={{ fontSize: "2rem" }}>{item?.orderId}</span>
                                </h2>

                                <div className="heading--row">
                                    <span className={`status status--${item?.paymentStatus}`}>
                                        <p>{item?.paymentStatus}</p>
                                    </span>
                                    <span className={`status status--${item?.deliveryStatus}`}>
                                        <p>{item?.deliveryStatus}</p>
                                    </span>
                                    <span className={`status status--${item?.orderStatus}`}>
                                        <p>{item?.orderStatus}</p>
                                    </span>
                                </div>
                            </div>

                            <p style={{ fontSize: "1.28rem", padding: "0" }} className='preview--body-item'>
                                Ordered: {formatDateSince(item?.orderDate)}
                            </p>
                        </div>
                    </span>

                    <span className='page__section--btns'>
                        <button className="page__section-top-btn table--btn" onClick={() => { }} style={{ padding: "0.4rem 1rem" }}>
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
                                <h2>Order Item</h2>
                                {/* {width > 400 && <Line border={1.4} where="Top" value="1rem" />} */}
                                <Line border={1.4} where="Top" value="1rem" />
                            </div>

                            <div className="item__preview--grid grid--1x1">
                                <div className="item__preview--item">
                                    <img style={{ width: "10rem" }} src={item?.products[0]?.image} alt={item?.products[0]?.name} />
                                    <div className="">
                                        <p>{item?.products[0].name}</p>
                                        <span>
                                            {item?.products[0]?.product_collection?.map(collection => (
                                                <p>{collection?.name}</p>
                                            ))}
                                        </span>
                                        
                                        <span>
                                            {item?.products[0]?.variations?.map(variant => (
                                                <span>
                                                    <p>{variant?.type}</p>
                                                    {(variant.type).toLowerCase() == "color" ? (
                                                        <ColorBox color={variant?.value} />
                                                    ) : (
                                                        <p>{variant?.value}</p>
                                                    )}
                                                </span>
                                            ))}
                                        </span>
                                    </div>
                                </div>

                                <span className="">
                                    <p>2 x ₦10,000</p>
                                    <span>
                                        Sub total
                                        <p>₦20,000</p>
                                    </span>
                                </span>
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
                                <h2>Brief Overview</h2>
                                <Line border={1.4} where="Top" value="1rem" />
                            </div>

                            
                        </div>


                        <div className="card">
                            <div className="section--heading">
                                <h2>Brief Overview</h2>
                                <Line border={1.4} where="Top" value="1rem" />
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default OrderItem