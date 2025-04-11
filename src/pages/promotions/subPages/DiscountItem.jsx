import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useWindowSize } from 'react-use';
import { useAuthContext } from '../../../context/AuthContext';
import { useFetchedContext } from '../../../context/FetchedContext';
import Line from '../../../components/elements/Line';
import BackButton from '../../../components/button/BackButton';
import Spinner from '../../../components/spinner/mainSpinner';
import CustomAlert from '../../../components/layout/CustomAlert';
import Delete from '../../../components/modal/Delete';
import { RiAddFill, RiDeleteBin5Line } from 'react-icons/ri';
import { BiChevronDown } from 'react-icons/bi';
import { GoDotFill } from 'react-icons/go';
import { calRemainingDays, formatDateSince } from '../../../utils/helper';


export default function DiscountItem() {
    const title = "discount"
    const { id } = useParams();
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { currency } = useAuthContext();
    const { handleFetchOneItem, handleDeleteOneItem, handleFetchMyStoreDiscounts } = useFetchedContext();

    ////////////////////////////////////////////////////
    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState({ status: null, message: null });
    const [error, setError] = useState(false);
    const [item, setItem] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
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
        document.title = `Quicka | Discount Details`;
    }, [item]);


    useEffect(function () {
        getItem();
    }, [id]);

    
    // DELETE FUNCTION
    async function deleteItem() {
        try {
            setLoading(true)
            await handleDeleteOneItem(title+"s", item?._id);
            setResponse({ message: "Successful!", response: "success" })
            handleFetchMyStoreDiscounts();
            
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

        {(error && !item && !loading) ? (
            <div style={{ height: "28rem" }} className='flex-align-center'>
                <ErrorComponent />
            </div>
        ) : (loading && !item && !error) ? (
            <Spinner />
        ) : (
            <div className='item__preview--section'>
                <div className='page__section--heading' style={{ alignItems: "flex-start" }}>
                    <div className="heading--col">
                        <span style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                            <BackButton close={() => navigate(-1)} />

                            <div className="heading--row" style={{ flexWrap: "wrap" }}>
                                <h2 className="page__section--title">
                                    Discount Details
                                </h2>
                                {width > 370 && (
                                    <span className={`status status--${item?.status}`}>
                                        <p style={{ textTransform: "capitalize" }}><GoDotFill /> {item?.status}</p>
                                    </span>
                                )}
                            </div>
                        </span>

                        {width <= 370 && (
                            <div className="heading--row" style={{ flexWrap: "wrap" }}>
                                <span className={`status status--${item?.status}`}>
                                    <p style={{ textTransform: "capitalize" }}><GoDotFill /> {item?.status}</p>
                                </span>
                            </div>
                        )}

                        <p style={{ fontSize: "1.28rem", padding: "0", textTransform: "none" }} className='preview--body-item'>
                            Created for a {item?.discountValidity} period, {item?.status == "active" ? `ends in just ${calRemainingDays(item?.endDate)} days` : `but has ${item?.status == "inactive" ? "been inactive" : "expired"} since ${formatDateSince(item?.endDate)}`}.
                        </p>
                    </div>

                    <span className='page__section--btns'>
                        <button className="page__section-top-btn add" onClick={() => setShowDeleteModal(true)} style={{ fontWeight: "600", color: "#444" }}>
                            <RiDeleteBin5Line size={20} />
                        </button>
                        <button className="page__section-top-btn" onClick={() => {}} style={{ fontWeight: "600", color: "#444" }}>
                            <RiAddFill size={20} /> {width > 800 ? "Add Items" : "Add"}
                        </button>
                        <span className="page__section--action" onMouseLeave={() => {}}>
                            <button onClick={() => {}} className="page__section-top-btn more">More Actions <BiChevronDown /></button>
                        </span>
                    </span>
                </div>

                {/* Section based things go here */}


                <div className="item__preview--grid grid--2x1">
                    <div className="left--side">
                        <div className="card form">
                            <div className="section--heading">
                                <h2>Title</h2>
                                <Line border={1.4} where="Top" value="1rem" />
                            </div>

                            {/*  */}
                        </div>

                        {/*  */}
                    </div>

                    <div className="right--side">
                        <div className="card form">
                            <div className="section--heading">
                                <h2>Contact</h2>
                                <Line border={1.4} where="Top" value="1rem" />
                            </div>

                            {/*  */}
                        </div>

                        {/*  */}
                    </div>
                </div>
            </div>
        )}
    </React.Fragment>

  )
}
