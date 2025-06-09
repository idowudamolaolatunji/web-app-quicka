import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useFetchedContext } from '../../../context/FetchedContext';
import { GoDotFill } from 'react-icons/go';
import { cap1stLetter, formatDate, formatDateSince, formatNumber, truncateString, ymdDateSlashTimeFormat } from '../../../utils/helper';
import Spinner from '../../../components/spinner/MainSpinner';
import CustomAlert from '../../../components/layout/CustomAlert';
import Delete from '../../../components/modal/Delete';
import BackButton from '../../../components/button/BackButton';
import { RiDeleteBin5Line, RiEdit2Fill } from 'react-icons/ri';
import { BiChevronDown } from 'react-icons/bi';
import { HiOutlineEnvelope, HiOutlinePhone } from 'react-icons/hi2';
import { PiMapPinArea } from 'react-icons/pi';
import { MdWhatsapp } from 'react-icons/md';
import Line from '../../../components/elements/Line';
import { useAuthContext } from '../../../context/AuthContext';
import { findFlagUrlByCountryName } from "country-flags-svg";
import TooltipUI from '../../../components/layout/TooltipUI';
import { imgString } from '../../../assets/images/png_elements';
import { IoArrowRedo, IoArrowRedoOutline } from 'react-icons/io5';
import { useWindowSize } from 'react-use';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import Empty from '../../../components/layout/Empty';
import moment from 'moment';
import { TbCashRegister } from 'react-icons/tb';
import ErrorComponent from '../../../components/layout/ErrorComponent';


export default function CustomerItem() {
    const title = "customer"
    const { id } = useParams();
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { currency } = useAuthContext();
    const { orders, handleFetchOneItem, handleDeleteOneItem, handleFetchMyStoreCustomers } = useFetchedContext();
    const avatar = "https://res.cloudinary.com/dy3bwvkeb/image/upload/v1737549092/pngegg_yirbea.png"
    const purchaseHistoryData =  orders.filter(order => order.customer._id === id) || [];

    const purchaseHistoryColumns = [
        {
            name: "Channel", selector: row => (
                <TooltipUI placement="top" title={cap1stLetter(row?.channel)}>
                    <img width={width > 450 ? "32px" : "24px"} alt={row?.channel} src={imgString(row?.channel)} />
                </TooltipUI>
            ), width: "70px"
        },
        {
            name: "Order Id", selector: row => (
                <Link to={row?._id} className="value">{row?.orderId}</Link>
            ), width: "100px"
        },
        {
            name: "Product(s)", selector: row => (
                <TooltipUI placement="top" title={
                    <ul className="table--list">
                        {row?.products?.map((item, index) => (
                            <li key={index}><IoArrowRedoOutline /> {item?.name}</li>
                        ))}
                    </ul>
                }>
                    <ul className="table--list">
                        {row?.products?.slice(0, 3)?.map((item, index) => (
                            <li key={index}>
                                {width > 600 ? (
                                    <Link to={item?.productId || "/"}><IoArrowRedo /></Link>
                                ) : (
                                    <IoArrowRedoOutline />
                                )}
                                {truncateString(item?.name, 18)}
                            </li>
                        ))}
                        {row?.products?.length > 3 && <li>...</li>}
                    </ul>
                </TooltipUI>
            ),
            width: "180px"
        },
        {
            name: "Amount", selector: row => (
                <span className="value">{currency}{formatNumber(row?.orderSubTotal)}</span>
            ), width: "100px"
        },
        {
            name: "Status", selector: row => (
                <span className={`status status--${row?.orderStatus}`}>
                    <p><GoDotFill />{row?.orderStatus}</p>
                </span>
            ),
            width: "120px"
        },
        {
            name: "Date Sold", selector: row => (
                <TooltipUI placement="top" title={formatDate(row?.orderDate)}>
                    <p>{formatDate(row?.orderDate)}</p>
                </TooltipUI>
            ),
        },
    ];

    const purchaseHistoryCustomStyles = {
        table: {
            style: {
                overflowX: 'auto',
            },
        },    
        head: {
            style: {
                fontSize: "1.44rem",
                fontWeight: "600",
                color: "#eee",
                height: width < 450 ? "4rem" : "4.5rem"
            },
        },
        rows: {
            style: {
                minHeight: '6rem',
                fontSize: "1.3rem",
                fontWeight: "500",
                cursor: 'pointer'
            },
        },
        headCells: {
            style: {
                paddingRight: '5px',
                backgroundColor: '#343434',
                height: width < 450 ? "4rem" : "4.5rem"
            },
        },
        cells: {
            style: {
                textAlign: 'center'
            }
        }
    };

    const totalAmountSpent = purchaseHistoryData?.reduce((sum, data) => sum + data?.orderSubTotal, 0) || 0;

    let mostBoughtItem;
    let mostRecentOrder;
    let maxBoughtItemCount = 0;
    let mostUsedSalesChannel = '';
    let maxSalesChannelCount = 0;
    let mostUsedPaymentMethod = '';
    let maxPaymentMethodCount = 0;

    const channels = {};
    const paymentMethods = {};

    // HERE WE MAP TO GET THE MOST BOUGHT ITEM, AND THE MOST RECENT PURCHASE
    purchaseHistoryData?.length > 0 && purchaseHistoryData?.forEach(order => {
        order.products.forEach(product => {
            const count = purchaseHistoryData.reduce((acc, curr) => {
                return acc + curr.products.filter(p => p.name === product.name).reduce((a, c) => a + c.quantity, 0);
            }, 0);
            console.log(count)
            if (count > maxBoughtItemCount) {
                maxBoughtItemCount = count;
                mostBoughtItem = product
            }
        });

        // ADDITIONALLY, WE TRY TO GET THE MOST USED SALES CHANNEL
        channels[order?.channel] = (channels[order?.channel] || 0) + 1;
        if (channels[order?.channel] > maxSalesChannelCount) {
            maxSalesChannelCount = channels[order?.channel];
            mostUsedSalesChannel = order?.channel;
        }
        
        // AND THE MOST USED PAYMENT METHOD
        paymentMethods[order.paymentMethod] = (paymentMethods[order.paymentMethod] || 0) + 1;
        if (paymentMethods[order.paymentMethod] > maxPaymentMethodCount) {
            maxPaymentMethodCount = paymentMethods[order.paymentMethod];
            mostUsedPaymentMethod = order.paymentMethod;
        }

        // FINALLY, THE MOST RECENT PURCHASE
        if (!mostRecentOrder || moment(order.orderDate).isAfter(moment(mostRecentOrder.orderDate))) {
            mostRecentOrder = order;
        }
    });

    ////////////////////////////////////////////////////
    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState({ status: null, message: null });
    const [error, setError] = useState(false);
    const [item, setItem] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [flagUrl, setFlagUrl] = useState("");
    ////////////////////////////////////////////////////

    const getItem = async function () {
        setError(false);
        try {
            const data = await handleFetchOneItem(title, id);
            if(!data) throw new Error("Connection Error");
            setItem(data)
        } catch (err) {
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(function() {
        window.scrollTo(0, 0);
        document.title = `Quicka - Customer Details: ${item?.firstname || "Loading.."} | Business Management Tool for SME's`;

        const countryName = String(item?.shippingAddress?.country?.name)?.toLowerCase();
        const flagUrl = findFlagUrlByCountryName(countryName);
        setFlagUrl(flagUrl)
    }, [item]);


    useEffect(function () {
        getItem();
    }, [id]);

    // DELETE FUNCTION
    async function deleteItem() {
        try {
            setLoading(true)
            await handleDeleteOneItem(`${title}s/${item?._id}`);
            setResponse({ message: "Successful!", response: "success" })
            handleFetchMyStoreCustomers();
            
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


    if(!item && error) {
        return (
            <div style={{ height: "28rem" }} className='flex-align-center'>
                <ErrorComponent />
            </div>
        )
    }

    return (
        <React.Fragment>

            {showDeleteModal && (
                <Delete
                    title={`"Customer"`}
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
                        <span style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                            <BackButton close={() => navigate(-1)} />

                            <div className="heading--row" style={{ flexWrap: "wrap" }}>
                                <h2 className="page__section--title">
                                    Customer Details
                                </h2>
                            </div>
                        </span>

                        <span className='page__section--btns'>
                            <button className="page__section-top-btn" onClick={() => navigate("edit")} style={{ fontWeight: "600", color: "#444" }}>
                                <RiEdit2Fill size={20} />
                            </button>
                            <button className="page__section-top-btn add" onClick={() => setShowDeleteModal(true)} style={{ fontWeight: "600", color: "#444" }}>
                                <RiDeleteBin5Line size={20} />
                            </button>
                            <span className="page__section--action" onMouseLeave={() => {}}>
                                <button onClick={() => {}} className="page__section-top-btn more">More Actions <BiChevronDown /></button>
                            </span>
                        </span>
                    </div>


                    <div className="item__preview--grid grid--2x1">
                        <div className="left--side">
                            <div className="card form">
                                <div className="item__preview--user">
                                    <span className="user--image">
                                        {item?.image?.url ? (
                                            <img src={item?.image?.url} alt={item?.firstname} />
                                        ) : (
                                            <img src={avatar} alt="user avatar" />
                                        )}
                                    </span>

                                    <div className="user--detail">
                                        <h3 className="details--title">{item?.fullname}</h3>
                                        <p style={{ fontSize: "1.28rem", padding: "0", textTransform: "none" }} className='preview--body-item'>
                                            Joined Since, {formatDateSince(item?.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="item__preview--insights">
                                    <div className="preview--insights-item">
                                        <span className="insights-item-title">Total Order</span>
                                        <p className='insights-item-value value'>{purchaseHistoryData?.length || 0}</p>
                                    </div>
                                    <div className="preview--insights-item">
                                        <span className="insights-item-title">Total Amount Spent</span>
                                        <p className='insights-item-value value'>{currency}{formatNumber(totalAmountSpent) || 0}</p>
                                    </div>
                                    <div className="preview--insights-item">
                                        <span className="insights-item-title">Last Order</span>
                                        {(purchaseHistoryData?.length > 0) ? (
                                            <p className='insights-item-value value' style={{ fontSize: "1.3rem" }}>{ymdDateSlashTimeFormat(mostRecentOrder?.orderDate)}</p>
                                        ) : (
                                            <span className='insights-item-value'>--</span>
                                        )}
                                    </div>
                                    <div className="preview--insights-item">
                                        <span className="insights-item-title">Preferred Payment</span>
                                        {purchaseHistoryData?.length > 0 ? (
                                            <span className='insights-item-value status status--pending'><p><TbCashRegister />{mostUsedPaymentMethod?.replace("-", " ")}</p></span>
                                        ) : (
                                            <span className='insights-item-value'>--</span>
                                        )}
                                    </div>
                                    <div className="preview--insights-item">
                                        <span className="insights-item-title">Most Purchased channel</span>
                                        {purchaseHistoryData?.length > 0 ? (
                                            <p className='insights-item-value flex-align-center' style={{ textTransform: "capitalize" }}>
                                                {mostUsedSalesChannel} <img style={{ width: "2.8rem" }} alt={mostUsedSalesChannel} src={imgString(mostUsedSalesChannel)} />
                                            </p>
                                        ) : (
                                            <span className='insights-item-value'>--</span>
                                        )}
                                    </div>
                                    <div className="preview--insights-item">
                                        <span className="insights-item-title">Most Purchsed Item</span>
                                        {purchaseHistoryData?.length > 0 ? (
                                            <div className="insights-item-product" onClick={() => navigate(`/dashboard/products/${mostBoughtItem?.productId}`)} style={{ cursor: "pointer" }}>
                                                <img src={mostBoughtItem?.image} alt={mostBoughtItem?.name} />
                                                <span>
                                                    <p className='insights-item-value'>{width < 450 ? truncateString(mostBoughtItem?.name, 20) : mostBoughtItem?.name}</p>
                                                    <span className='flex-align-center' style={{ flexWrap: "wrap" }}>
                                                        {mostBoughtItem?.product_collection?.slice(0, 2)?.map((collection, i) => (
                                                            <p className='product__figure--collection' key={i}>{collection}</p>
                                                        ))}
                                                        <span className='insights-item-title flex-align-center' style={{ fontSize: "1rem" }}><GoDotFill /> <span>Bought <span className='value'>{maxBoughtItemCount}</span> {mostBoughtItem?.unit || "pair"}</span></span>
                                                    </span>

                                                </span>
                                            </div>
                                        ) : (
                                            <span className='insights-item-value'>--</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="card recent-section customer form" style={{ padding: 0 }}>
                                <div className="section--heading" style={{ padding: '2rem 2rem 0' }}>
                                    <h2>Purchase History</h2>
                                </div>

                                <div className="table-h">
                                    <DataTable
                                        data={purchaseHistoryData}
                                        columns={purchaseHistoryColumns}
                                        pointerOnHover={true}
                                        customStyles={purchaseHistoryCustomStyles}
                                        onRowClicked={(row) => navigate(`/dashboard/orders/${row?._id}`)}
                                        noDataComponent={<Empty text="order history yet!" />}
                                        pagination
                                        paginationRowsPerPageOptions={[3, 5, 10]}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="right--side">
                            <div className="card form">
                                <div className="section--heading">
                                    <h2>Contact</h2>
                                    <Line border={1.4} where="Top" value="1rem" />
                                </div>

                                <div className="item__preview--customer">
                                    <span className="item--box">
                                        <span className="box--icon"><HiOutlinePhone /></span>
                                        <p className="box--text value" style={{ fontSize: "1.2rem" }}>+{item?.contact?.phone}</p>
                                    </span>
                                    <span className="item--box">
                                        <span className="box--icon"><HiOutlineEnvelope /></span>
                                        <p className="box--text">{item?.contact?.email}</p>
                                    </span>
                                    <span className="item--box">
                                        <span className="box--icon"><MdWhatsapp /></span>
                                        <a className="box--text link" target='_blank' href={`https://wa.me/${item?.contact?.phone}`}>Message via whatsapp</a>
                                    </span>
                                </div>
                            </div>

                            <div className="card form">
                                <div className="section--heading">
                                    <h2>Address</h2>
                                    <Line border={1.4} where="Top" value="1rem" />
                                </div>
                            
                                <div className="item__preview--customer">
                                    <span className="item--box">
                                        <span className="box--icon" style={{ width: "3rem" }}><PiMapPinArea /></span>
                                        <p className="box--text">{item?.shippingAddress?.address || "Address Not Selected"}</p>
                                    </span>
                                    <span className="item--box">
                                        <span className="box--icon" style={{ width: "2.6rem", padding: "0 .28rem" }}><img src={flagUrl} alt={item?.shippingAddress?.country?.name} /></span>
                                        <p className="box--text">{item?.shippingAddress?.country?.name}</p>
                                    </span>
                                </div>

                                <div className="item__preview--summary payment">
                                    <div className='preview--body-item'>State <span className='preview--body-value'>{item?.shippingAddress?.state?.name ? `${item?.shippingAddress?.state?.name} (${item?.shippingAddress?.state?.iso2})` : "--"} </span></div>
                                    <div className='preview--body-item'>City <span className='preview--body-value value'>{item?.shippingAddress?.city?.name || "--"}</span></div>
                                    <div className='preview--body-item'>Zipcode <span className='preview--body-value value'>{item?.shippingAddress?.zipCode || "--"}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    )
}