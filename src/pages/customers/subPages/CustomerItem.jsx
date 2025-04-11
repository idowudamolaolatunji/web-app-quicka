import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useFetchedContext } from '../../../context/FetchedContext';
import { GoDotFill } from 'react-icons/go';
import { formatDateSince, formatNumber } from '../../../utils/helper';
import Insight from '../../../components/layout/Insight';
import Spinner from '../../../components/spinner/mainSpinner';
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


export default function CustomerItem() {
    const title = "customer"
    const { id } = useParams();
    const navigate = useNavigate();
    const { currency } = useAuthContext()
    const { handleFetchOneItem, handleDeleteOneItem, handleFetchMyStoreCustomers } = useFetchedContext();
   
    ////////////////////////////////////////////////////
    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState({ status: null, message: null });
    const [error, setError] = useState(false);
    const [item, setItem] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [flagUrl, setFlagUrl] = useState("")
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
        document.title = `Quicka | Customer Details - ${item?.firstname}`;

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
            await handleDeleteOneItem("customers", item?._id);
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

            {(error && !item) && <ErrorComponent />}

            {(loading && !item && !error) ? (
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

                            </div>

                            <div className="card">
                                <div className="section--heading">
                                    <h2>Purchase History</h2>
                                    <Line border={1.4} where="Top" value="1rem" />
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
                                    <span className="item--box" onclick="window.location.href='mailto:user@example.com'">
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
                                        <p className="box--text">{item?.shippingAddress?.address}</p>
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