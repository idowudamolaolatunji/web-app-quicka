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
import { GoDotFill } from 'react-icons/go';
import { calRemainingDays, formatDateSince } from '../../../utils/helper';
import { RiAddFill, RiDeleteBin5Line } from 'react-icons/ri';
import { BiChevronDown } from 'react-icons/bi';
import MainDropdownSelect from '../../../components/form/MainDropdownSelect';
import ProductPreview from '../../../components/layout/ProductPreview.jsx';
import Drawer from '../../../components/modal/Drawer';
import { BsHandbag } from 'react-icons/bs';
import { HiOutlineCollection } from 'react-icons/hi';
import TooltipUI from "../../../components/layout/TooltipUI.jsx";


export default function CouponItem() {
    const title = "coupon"
    const { id } = useParams();
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { currency } = useAuthContext();
    const { products, collections, handleFetchOneItem, handleDeleteOneItem, handleFetchMyStoreCoupons } = useFetchedContext();

    ////////////////////////////////////////////////////
    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState({ status: null, message: null });
    const [error, setError] = useState(false);
    const [item, setItem] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    ////////////////////////////////////////////////////
    const [couponProducts, setCouponProducts] = useState([]);
    const [couponCollection, setCouponCollection] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);


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
        document.title = `Quicka | Coupon Details - ${item?.couponCode}`;
    }, [item]);


    useEffect(function () {
        getItem();
    }, [id]);


    // REMOVE A PRODUCT FROM THE Coupon PRODUCTS ARRAY
    const handleRemoveItem = function(id) {
        setCouponProducts(prev => prev?.filter(product => product._id !== id))
    }

    // DELETE FUNCTION
    async function deleteItem() {
        try {
            setLoading(true)
            await handleDeleteOneItem(title+"s", item?._id);
            setResponse({ message: "Successful!", response: "success" })
            handleFetchMyStoreCoupons();
            
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
                // title={`"Coupon"`}
                text=''
                close={setShowDeleteModal} 
                fn={deleteItem}
            />
        )}

        {showAddModal && (
            <Drawer title={`Add Items`} setClose={() => setShowAddModal(false)}>
                <div className="form--item" style={{ marginTop: "3rem" }}>
                    <label className="form--label">
                        Add {item?.couponGroup != "collections" ? (
                            <>Products <BsHandbag /></>
                        ) : (
                            <>Collections <HiOutlineCollection /></>
                        )} 
                    </label>
                    {item?.couponGroup !== "collections" ? (
                        <React.Fragment>
                            <MainDropdownSelect subtitle={`Product to add to add coupon`} title="Product" options={products} field="name" value={couponProducts} setValue={setCouponProducts} noDataLabel="No product found!" multiple={item?.couponGroup == "bundle" ? true : false} />
                            {couponProducts?.length > 0 && (
                                <div className="product--quantity-grid">
                                    {couponProducts?.map((product) => (
                                        <ProductPreview
                                            product={product}
                                            removeItem={handleRemoveItem}
                                        />
                                    ))}
                                </div>
                            )}
                        </React.Fragment>
                    ) : (
                        <MainDropdownSelect title="Collection" options={collections} field="name" value={couponCollection} setValue={setCouponCollection} multiple={true} noDataLabel="No collection found!" />
                    )}
                </div>
            </Drawer>
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
                                    Coupon Details - {item?.couponCode}
                                </h2>

                                {width > 850 && (
                                    <div className="heading--row" style={{ flexWrap: "wrap" }}>
                                        <span className={`status status--${item?.status}`}>
                                            <p style={{ textTransform: "capitalize" }}><GoDotFill /> {item?.status}</p>
                                        </span>

                                        <span className={`status status--neutral`}>
                                            <p style={{ textTransform: "capitalize" }}> {item?.couponGroup != "collections" ? (
                                                <><BsHandbag /> {item?.couponGroup} product</>
                                            ) : (
                                                <><HiOutlineCollection /> product {item?.couponGroup}</>
                                            )}</p>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </span>

                        {width <= 850 && (
                            <div className="heading--row">
                                <span className={`status status--${item?.status}`}>
                                    <p style={{ textTransform: "capitalize" }}><GoDotFill /> {item?.status}</p>
                                </span>

                                <span className={`status status--neutral`}>
                                    <p style={{ textTransform: "capitalize" }}> {item?.couponGroup != "collections" ? (
                                        <><BsHandbag /> {item?.couponGroup} product</>
                                    ) : (
                                        <><HiOutlineCollection /> product {item?.couponGroup}</>
                                    )}</p>
                                </span>
                            </div>
                        )}

                        <p style={{ fontSize: "1.28rem", padding: "0", textTransform: "none" }} className='preview--body-item'>
                            Created for a {item?.couponValidity} period, {item?.status == "active" ? `ends in just ${calRemainingDays(item?.endDate)} days` : `but has ${item?.status == "inactive" ? "been inactive" : "expired"} since ${formatDateSince(item?.endDate)}`}.
                        </p>
                    </div>

                    <span className='page__section--btns'>
                        <button className="page__section-top-btn add" onClick={() => setShowDeleteModal(true)} style={{ fontWeight: "600", color: "#444" }}>
                            <RiDeleteBin5Line size={20} />
                        </button>
                        <TooltipUI title={item?.couponGroup == "all" || (item?.couponGroup == "single" && item?.items?.length > 0) ? `Cannot add more items to ${item?.couponGroup} product` : "Add more items"} placement="top">
                            <button className="page__section-top-btn" onClick={() => setShowAddModal(!showAddModal)} style={{ fontWeight: "600", color: "#444" }} disabled={item?.couponGroup == "all" || (item?.couponGroup == "single" && item?.items?.length > 0)}>
                                <RiAddFill size={20} /> {width > 800 ? "Add Items" : "Add"}
                            </button>
                        </TooltipUI>
                        <span className="page__section--action" onMouseLeave={() => {}}>
                            <button onClick={() => {}} className="page__section-top-btn more">More Actions <BiChevronDown /></button>
                        </span>
                    </span>
                </div>

                {/* Section based things go here */}


                <div className="item__preview--grid grid--1-6x1">
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
