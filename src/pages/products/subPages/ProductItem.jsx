import React, { useEffect, useState } from 'react'
import { useFetchedContext } from '../../../context/FetchedContext';
import { useNavigate, useParams } from 'react-router-dom';
import { GoDotFill } from 'react-icons/go';
import Spinner from '../../../components/spinner/MainSpinner';
import CustomAlert from '../../../components/layout/CustomAlert';
import BackButton from '../../../components/button/BackButton';
import { ImEyeBlocked, ImEye } from 'react-icons/im';
import { formatDateSince, formatNumber, truncateString } from '../../../utils/helper';
import { RiDeleteBin5Line, RiEdit2Fill } from 'react-icons/ri';
import { BiChevronDown } from 'react-icons/bi';
import Line from '../../../components/elements/Line';
import { useAuthContext } from '../../../context/AuthContext';
import { ColorBoxPreview } from '../../../components/elements/ColorBox';
import { useWindowSize } from 'react-use';
import Delete from '../../../components/modal/Delete';
import ErrorComponent from '../../../components/layout/ErrorComponent';
import { Gallery, Item } from 'react-photoswipe-gallery';
import empty_product from "../../../assets/images/dummy_items/empty_product.png";
import { PiShareFatFill } from 'react-icons/pi';
import SimpleModal from '../../../components/modal/SimpleModal';
import { AiOutlineClose } from 'react-icons/ai';
import { ShareSocial } from 'react-share-social';

const BASE_API_URL = import.meta.env.VITE_API_URL;

const shareModalstyle = {
    root: {
        marginTop: "1.5rem",
        background: "transparent",
        padding: "0",
        fontFamily: "inherit",
        color: "#333"
    },
    copyContainer: {
        border: "none",
        background: "#eee",
        color: "#444"
    },
}

function ProductItem() {
    const title = "product"
    const { id } = useParams();
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { currency, store, headers } = useAuthContext();
    const { handleFetchOneItem, handleDeleteOneItem, handleFetchMyStoreProducts } = useFetchedContext();
    
    ////////////////////////////////////////////////////
    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState({ status: null, message: null });
    const [error, setError] = useState("");
    const [item, setItem] = useState(null);
    const [showModal, setShowModal] = useState({ delete: false, share: false });
    const [showMoreActions, setShowMoreActions] = useState(false);
    ////////////////////////////////////////////////////
    const [curImageIndex, setCurImageIndex] = useState(0);
    const colorSpelling = ["color", "colour", "colors", "colours"];

    
    const getItem = async function () {
        try {
            const result = await handleFetchOneItem(title, id);
            if (result?.message) throw new Error();
            setItem(result);
        } catch (err) {
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(function() {
        window.scrollTo(0, 0);
        document.title = `Quicka - Product Details: ${item?.productId || "Loading.."} | Business Management Tool for SME's`;
    }, [item]);

    
    useEffect(function () {
        setLoading(true);
        getItem();
    }, [id]);


    async function handleToggleStatus() {
        try {
            setItem({ ...item, status: item?.status == "published" ? "unpublished" : "published" });
            const url = `${BASE_API_URL}/products/toggle-status/${id}`;
            const res = await fetch(url, { method: "PATCH", headers });
            const data = await res.json();
            setItem(data?.data?.product);
            handleFetchMyStoreProducts();
        } catch (err) {
            setResponse({ message: "Error!", response: "error" })
        }
    }

    // DELETE FUNCTION
    async function deleteItem() {
        try {
            setLoading(true)
            await handleDeleteOneItem(`products/${item?._id}`);
            setResponse({ message: "Successful!", response: "success" })
            handleFetchMyStoreProducts();
            
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
                    title={`"Product"`}
                    close={() => setShowModal({ ...showModal, delete: false })} 
                    fn={deleteItem}
                />
            )}

            {showModal.share && (
                <SimpleModal
                    title="Share Product Link" icon={<AiOutlineClose />}
                    customstyle={{ minHeight: "20rem", height: "25rem" }}
                    setClose={() => setShowModal({ ...showModal, share: false })}
                >
                    <ShareSocial
                        url={`https://${store?.storeUrl}/products/${item?.slug}`}
                        socialTypes={['facebook','twitter','whatsapp','linkedin', "telegram", "email"]}
                        style={shareModalstyle}
                    />
                </SimpleModal>
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
                                Uploaded product, {formatDateSince(item?.createdAt)}
                            </p>
                        </div>

                        <span className='page__section--btns'>
                            <button className="page__section-top-btn" onClick={() => navigate("edit")} style={{ fontWeight: "600", color: "#444" }}>
                                <RiEdit2Fill size={20} /> {width > 800 ? "Edit Item" : "Edit"}
                            </button>
                            <button className="page__section-top-btn add" onClick={() => setShowModal({ ...showModal, delete: true })} style={{ fontWeight: "600", color: "#444" }}>
                                <RiDeleteBin5Line size={20} />
                            </button>
                            <span className="page__section--action" onMouseLeave={() => setShowMoreActions(false)}>
                                <button onClick={() => setShowMoreActions(!showMoreActions)} className="page__section-top-btn more">More Actions <BiChevronDown /></button>

                                {showMoreActions && (
                                    <ul className="page__section--dropdown">
                                        <li onClick={handleToggleStatus}>
                                            <span>
                                                {item?.status == "published" ? <ImEyeBlocked /> : <ImEye />}
                                            </span>
                                            {item?.status == "published" ? 'Unpublish' : 'Publish'}
                                        </li>

                                        <li onClick={() => setShowModal({ ...showModal, share: true })}>
                                            <span><PiShareFatFill /></span> Share Link
                                        </li>
                                    </ul>
                                )}
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
                                    <div className='preview--body-item'>Description <div className='preview--body-value' style={{ color: "#444" }} dangerouslySetInnerHTML={{ __html: truncateString(item?.description, 400) }} /></div>
                                    <div className='preview--body-item'>Price <span className='preview--body-value value'>{item?.priceInFigure}</span></div>
                                    <div className='preview--body-item'>Remaining Stock 
                                        <span className='preview--body-value value'>{formatNumber(item?.stockAmount) || 0} Items</span>
                                    </div>
                                    <div className='preview--body-item'>Product Unit <span className='preview--body-value'>{item?.unit || "--"}</span></div>
                                    <div className='preview--body-item'>Discount <span className='preview--body-value value'>{item?.discount?.discountType == "fixed-price" ? currency : "--"}{item?.discount?.discountValueInFigure || ""}</span></div>
                                    <div className='preview--body-item'>Already Sold <span className={`preview--body-value ${item?.soldAmount ? "value" : ""}`}>{item?.soldAmount ? `${item?.soldAmount} Items` : "None"}</span></div>

                                    <div className='preview--body-item' style={{ alignItems:"flex-start" }}>Variation Options
                                        <span className='preview--body-value' style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                            {item?.variationOptions.length > 0 ? item?.variationOptions?.map(option =>
                                                <div className="flex-align-center">
                                                    <span style={{ textTransform: "capitalize" }}>{option?.label?.endsWith("s") ? option?.label : option?.label + "s"}:</span>
                                                    {colorSpelling.includes(option?.label) ? (
                                                        <>{option?.values?.map(color => <ColorBoxPreview color={color} />)}</>
                                                    ) : (
                                                        <>{option?.values?.map(value => <span className='variant-tab'>{value}</span>)}</>
                                                    )}
                                                </div>
                                            ) : "--"}
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
                            
                                <Gallery options={{ zoom: true, counter: true, bgOpacity: 1 }}>
                                    <div className="item__preview--images">
                                        <Item
                                            sourceId={curImageIndex}
                                            original={item?.images[curImageIndex]?.url?.replace("h_950,q_80,w_950", "h_1150,q_85,w_auto")} 
                                            height={item?.images[curImageIndex]?.height || "950"}
                                            width={item?.images[curImageIndex]?.width || "950"}
                                            alt={item?.name}
                                        >
                                            {({ ref, open }) => (
                                                <img src={!item?.images[0]?.url ? empty_product : item?.images[curImageIndex]?.url?.replace("q_80", "q_50")} ref={ref} onClick={open} alt={`${item?.name} image ${curImageIndex + 1}`} className='main--img' />
                                            )}
                                        </Item>

                                        <span className="images--img">
                                            {item?.images?.map((img, i) => (
                                                <span onClick={() => setCurImageIndex(i)}>
                                                    <img src={img?.url} alt={`${item?.name} - ${i + 1}`} className={curImageIndex == i ? 'active-img' : ""} />
                                                </span>
                                            ))}
                                        </span>
                                    </div>
                                </Gallery>
                            </div>
                        </div>
                    </div>

                </div>
            )}
           

        </React.Fragment>
    )
}

export default ProductItem