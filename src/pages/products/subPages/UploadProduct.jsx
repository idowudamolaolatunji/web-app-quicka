import React, { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use';
import CurrencyInput from 'react-currency-input-field';

import Info from '../../../components/elements/Info';
import Line from '../../../components/elements/Line';
import Asterisk from '../../../components/elements/Asterisk';
import QuillEditor from '../../../components/form/QuillEditor';
import { useAuthContext } from '../../../context/AuthContext';
import { useFetchedContext } from '../../../context/FetchedContext';
import MainDropdownSelect from '../../../components/form/MainDropdownSelect';

import { LuTags } from 'react-icons/lu';
import { FaCheck } from 'react-icons/fa';
import { AiOutlinePlus } from 'react-icons/ai';
import { validateProductForm } from '../../../utils/validationHelper';
import { useNavigate, useParams } from 'react-router-dom';
import Drawer from '../../../components/modal/Drawer';
import CollectionFormSm from '../../../components/pageComponents/CollectionFormSm';
import { createPortal } from 'react-dom';
import { units } from '../../../utils/data';
import { RiDeleteBin5Line, RiEdit2Line } from 'react-icons/ri';
import { Switch } from '@mui/material';
import AddPageUI from '../../../ui/PageUI/AddPageUI';
import MultipleImageUploadInput from '../../../components/form/MultipleImageUploadInput';
import { formatNumber } from '../../../utils/helper';
import { useCheckInternetConnection } from '../../../hooks/useCheckInternetConnection';
import RadioInput from '../../../components/form/RadioInput';
import BgSimple from '../../../components/modal/BgSimple';
import VariantOptions from '../../../components/pageComponents/VariantOptions';
import DataTable from 'react-data-table-component';
import { CiImageOn } from 'react-icons/ci';
import VariationImage from '../../../components/pageComponents/VariationImage';
import Delete from '../../../components/modal/Delete';
import { IoPlayCircleOutline } from 'react-icons/io5';



export default function UploadProduct({ isnew=false, close, ismodal=false }) {
    const navigate = useNavigate();
    const { id } = useParams();
    const { width } = useWindowSize();
    const internetStatus = useCheckInternetConnection();
    const { shouldKick, handleStore, store, formdataHeader } = useAuthContext();
    const { error, loader, collections, handleFetchOneItem, handleFetchError, handleFetchMyStoreProducts, handleFetchMyStoreCollections, handleFetchMyStoreDiscounts } = useFetchedContext();
    const BASE_API_URL = import.meta.env.VITE_API_URL;
    const maxImageAmount = store?.subscription?.type == "free" ? 4 : 10;
    const currency = store?.currency?.symbol;

    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({ status: null, message: null });
    const [showConfetti, setShowConfetti] = useState(false)
    const [showModal, setShowModal] = useState({
        collection: false,
        deleteVaraition: false,
        deleteMultipleVariation: false,
        addImage: false, variation: false,
        inputPrice: false, inputQuantity: false,
    });
    
    const [description, setDescription] = useState("");
    const [productCollection, setProductCollection] = useState([]);
    const [unit, setUnit] = useState([]);
    const [showMOQ, setShowMOQ] = useState(false);
    
    const [variations, setVariations] = useState([]);
    const [variationOptions, setVariationOptions] = useState([]);
    const [seletedVariationId, setSeletedVariationId] = useState("");

    const [productFormErrors, setProductFormErrors] = useState({});
    const [fetchedProduct, setFetchedProduct] = useState(null);
    const [productData, setProductData] = useState({
        name: "",
        shortDescription: "",
        price: null,
        itemCost: null,
        status: "published",
        discountValue: null,
        discountType: "no-discount",
        stockAmount: null,
        MOQ: "",
        hasVariation: false,
        isPhysical: true,
        isHidden: false,
    });

    const [images, setImages] = useState([]);
    const imageFiles = images.filter(img => img?.file)?.map(img => img?.file);
    const [updatedIndexes, setUpdatedIndexes] = useState([]);
    const [selectedRowsId, setSelectedRowsId] = useState([]);

    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////

    const variation_columns_Styles = {
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
            },
        },
        headCells: {
            style: {
                paddingRight: '5px',
                backgroundColor: '#343434',
                height: width < 450 ? "4rem" : "4.5rem"
            },
        },
        
    };

    const variation_columns = [
        {
            name: "Image",
            selector: row => (
                <span
                    className='form--media'
                    onClick={() => handleVariantionImage(row?.id)}
                >
                        {console.log(row)}
                    {row?.imageIndex == null ? <CiImageOn /> : <img src={images[row?.imageIndex]?.data_url} alt={"product name"} />}
                </span>
            ),
            width: "8rem"
        },
        {
            name: 'Variant',
            selector: row => row?.name,
            minWidth: "10rem"
        },
        {
            name: <span className='flex-align-center'>Price <Asterisk /></span>,
            selector: row => (
                <CurrencyInput name='price' className='table form--input' value={row?.price} placeholder={currency+"5,000"} prefix={currency} onValueChange={(value, name, _) => handleChangeVariationData(name, value, row?.id)} />
            ),
            width: "13rem"
        },
        {
            name: "Cost (Optional)",
            selector: row => (
                <CurrencyInput name='cost' className='table form--input' value={row?.cost} placeholder={currency+"2,000"} prefix={currency} onValueChange={(value, name, _) => handleChangeVariationData(name, value, row?.id)} />
            ),
            width: "13rem"
        },
        {
            name: <span className='flex-align-center'>Quantity <Asterisk /></span>,
            selector: row => (
                <CurrencyInput name='quantity' className='table form--input' value={row?.quantity} placeholder="10" onValueChange={(value, name, _) => handleChangeVariationData(name, value, row?.id)} />
            ),
            width: "13rem"
        },
        {
            name: "Discount Price (Optional)",
            selector: row => (
                <CurrencyInput name='discountValue' className='table form--input' value={row?.discountValue} placeholder={currency+"1,000"} prefix={currency} onValueChange={(value, name, _) => handleChangeVariationData(name, value, row?.id)} />
            ),
            width: "18rem"
        },
        {
            selector: row => (
                <span className='table--actions'>
                    <button className='table--btn' onClick={() => handleShowVariationDeleteModal(row?.name)}><RiDeleteBin5Line /></button>
                </span>
            ),
            width: "10rem"
        }
    ];

    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////


    // HANDLE CHANGE VARIATION DATA
    function handleChangeVariationData(name, value, id) {
        setVariations(prev => prev.map(variation => variation?.id == id ? {...variation, [name]: value } : variation))
    }

    // DELETE PRODUCT VARIATION
    function handleDeleteVariation() {
        setVariations(prev => prev.filter((item) => seletedVariationId !== item?.name));
        setShowModal({ ...showModal, deleteVaraition: false });
        setSeletedVariationId("");
    }

    // DELETE MULTIPLE PRODUCT VARIATION
    function handleDeleteMultipleVariation() {
        setVariations(prev => prev.filter((item) => !selectedRowsId.includes(item?.id)));
        setShowModal({ ...showModal, deleteMultipleVariation: false });
        setSelectedRowsId([]);
    }

    // SHOW PRODUCT VARIATION DELETION MODAL
    function handleShowVariationDeleteModal(name) {
        setShowModal({ ...showModal, deleteVaraition: true });
        setSeletedVariationId(name);
    }

    // SHOW PRODUCT VARIATION IMAGE MODAL
    function handleVariantionImage(id) {
        setShowModal({ ...showModal, addImage: true });
        setSeletedVariationId(id);
    }

    // DELETE VARIATION OPTION
    function handleDeleteVariantOption(id) {
        setVariationOptions(prev => prev.filter((item) => id !== item?.id));
    }

    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////

    // MULTIPLE IMAGES ON CHANGE
    const handleOnChangeImage = function(imageList, addUpdateIndex) {
        // console.log(imageList)
        setImages(imageList);
        
        /////////////////////////////
        // this here might feel strange in the future, but it helps us keep track of the updated images
        if(addUpdateIndex !== undefined && id) {
            setUpdatedIndexes((prev) => 
                [...new Set([...prev, addUpdateIndex?.at(0)])].sort((a, b) => a - b)
            )
        }
    };


    const handleProductDataChange = function(e) {
        const { name, value } = e?.target;

        setProductData({
            ...productData,
            [name]: value,
        });
    }


    const handleToggleModal = function(name) {
        setShowModal({...showModal, [name]: !showModal[name] })
    }

    // CLEAR FIELDS
    const handleClearFields = function() {
        setProductData({
            ...productData,
            name: "",
            shortDescription: "",
            price: null,
            itemCost: null,
            discountValue: null,
            stockAmount: null,
            // status: "published",
            hasVariation: false,
            isPhysical: true,
            isHidden: false,
        });
        setVariations([]);
        setDescription("")
        setProductCollection([])
        setProductFormErrors({});
        setImages([])
        
        window?.scrollTo({ top: 0, behavior: "smooth" });
        setProductFormErrors({});
        setResponse({ status: "", message: "" })
    }


    useEffect(function() {
        (async () => {
            if(id) {
                setLoading(true);
                const fetchedItem = await handleFetchOneItem("product", id);
                setLoading(false);

                if(fetchedItem) {
                    setFetchedProduct(fetchedItem);
                    setProductData({
                        name: fetchedItem?.name || "",
                        shortDescription: fetchedItem?.shortDescription || "",
                        price: fetchedItem?.price || null,
                        itemCost: fetchedItem?.itemCost ||null,
                        discountValue: fetchedItem?.discount?.discountValue || null,
                        stockAmount: fetchedItem?.stockAmount || null,
                        // status: fetchedItem?.status || "published",
                        discountType: fetchedItem?.discount?.discountType || "no-discount",
                        isPhysical: fetchedItem?.isPhysical || true,
                        isHidden: fetchedItem?.isHidden || false,
                        hasVariation: fetchedItem?.hasVariation || false,
                    });
                    setVariations(fetchedItem?.variations || []);
                    setVariationOptions(fetchedItem?.variationOptions || []);
                    setDescription(fetchedItem?.description || "")
                    setProductCollection(fetchedItem?.product_collection)
                    setImages(fetchedItem?.images?.map((img) => (
                        { data_url: img?.url }
                    )));
                    setUnit(fetchedItem?.unit ? [{ name: fetchedItem?.unit, id: 0 }] : []);
                }
            }
        })();
    }, [id]);

    const cartesianProduct = function(...arrays) {
        return arrays.reduce((a, b) => a.flatMap(x => b.map(y => [...x, y])), [[]]);
    };

    // CREATE VARIATION
    useEffect(function() {
        const generateVariations = () => {
            if (variationOptions?.length === 0) {
                setVariations([]);
                return;
            }

            const values = variationOptions?.map(option => option.values);
            const combinations = cartesianProduct(...values);

            // const newVariations = combinations.map(combination => {
            //     const name = combination.join('-').toLowerCase();
            //     return {
            //         name,
            //         quantity: null,
            //         price: null,
            //         cost: null,
            //         discountPrice: null,
            //         imageIndex: null,
            //         id: `${name}-${Math.floor(Math.random() * 9000) + 1000}`,
            //     };
            // });

            const newVariations = combinations.map(combination => {
                const name = combination.join('-').toLowerCase();
                const existingVariation = variations?.find(v => v.name === name);
                return existingVariation || {
                    name,
                    quantity: null,
                    price: null,
                    cost: null,
                    discountPrice: null,
                    imageIndex: null,
                    id: `${name}-${Math.floor(Math.random() * 9000) + 1000}`,
                };
            });

            setVariations(newVariations);
        };

        generateVariations();
    }, [variationOptions]);


    // EFFECTS AND LIFECYCLE
    useEffect(function() {
        document.title = `Quicka - ${id ? `Edit ${productData.name}` : "Upload"} Product | Business Management Tool for SME's`;

        // FETCH PRODUCT COLLECTION
        if(collections?.length < 1 && error?.collection) {
            handleFetchMyStoreCollections()
        }
    }, []);


    // REMOVE THE VALUE WHEN WE SWITCH THE DISCOUNT TYPES
    useEffect(function () {
        const type = productData.discountType;
        if(id && fetchedProduct?.discount?.discountType == type) {
            setProductData({ ...productData, discountValue: fetchedProduct?.discount?.discountValue });
        } else {
            setProductData({ ...productData, discountValue: "" });
        }

    }, [productData.discountType, id]);


    useEffect(function () {
        if(productData.hasVariation) {
            setProductData({ ...productData, price: null, itemCost: null });
            setVariations([])
            setVariationOptions([])

            // scroll to bottom if when the display chages
            width > 750 && window.scrollTo({ top: 1000, behavior: "smooth" });
        } else {
            width > 750 && window.scrollTo({ top: 0, behavior: "smooth" });
        }

        if(!productData.isPhysical) {
            setProductData({ ...productData, hasVariation: false });
        }
    }, [productData.hasVariation, productData.isPhysical]);



    async function handleSubmitProduct(e) {
        // FORM VALIDATIONS 
        let formData = {
            ...productData,
            productCollection,
            images, description,
            variations, variationOptions
        }

        const newErrors = validateProductForm(formData);
        console.log(newErrors)
        setProductFormErrors(newErrors);
        if (Object.keys(newErrors).length >= 1) {
            setResponse({ status: "error", message: "Fill required fields to proceed!" });
            setTimeout(() => setResponse({ status: "", message: "" }), 5000);
            return;
        };

        const incompletedVariations = variations.filter(variation => {
            return !variation.price || !variation.quantity;
        });

        console.log(variations, incompletedVariations)
        if (incompletedVariations.length > 0) {
            setResponse({ status: "error", message: "Fill up variation prices and quantity!" });
            setTimeout(() => setResponse({ status: "", message: "" }), 7000);
            return;
        }


        // SET LOADER
        setResponse({ status: "", message: "" });
        setLoading(true);
        
        // GET COLLECTION NAMES
        const colection_Ids = productCollection?.map(collection => collection._id);
        const itemUnit = unit[0]?.value || "";
        
        // check if it's creating new, first onboard or editing
        const parameter = isnew ? `/onboard/product?slug=${store?.slug}` : id ?`/${fetchedProduct?._id}` : `?slug=${store?.slug}`;
        
        try {
            // CHECK CONNECTION
            if(internetStatus == "offline") throw new Error("Internet Error");

            const formData = new FormData();
            formData.append('name', productData.name);
            formData.append('description', description);
            formData.append('shortDescription', productData.shortDescription);
            productData.price && formData.append('price', +productData.price);
            productData.price && formData.append('priceInFigure', `${currency}${formatNumber(productData.price)}`);
            productData.itemCost && formData.append('itemCost', +productData.itemCost);
            productData.discountValue && formData.append('discountValue', +productData.discountValue);
            productData.stockAmount && formData.append('stockAmount', +productData.stockAmount);
            formData.append('discountType', productData.discountType);
            formData.append('MOQ', +productData.MOQ);
            formData.append('unit', itemUnit);
            formData.append('product_collection', JSON.stringify(colection_Ids));
            formData.append('isPhysical', JSON.stringify(productData.isPhysical));
            formData.append('isHidden', JSON.stringify(productData.isHidden));
            formData.append('hasVariation', JSON.stringify(productData.hasVariation));
            // formData.append('status', productData.status);
            if(productData.hasVariation && variations?.length > 0) {
                formData.append('variations', JSON.stringify(variations));
                formData.append('variationOptions', JSON.stringify(variationOptions));
            }
            
            if(!id) {
                for(const image of imageFiles) {
                    formData.append("images", image);
                }
            } else {
                if(updatedIndexes && imageFiles) {
                    formData.append("updatedIndexes", JSON.stringify(updatedIndexes));

                    for(const image of imageFiles) {
                        formData.append("images", image);
                    }
                }
            }
            
            // MAKE REQUEST
            const res = await fetch(`${BASE_API_URL}/products${parameter}`, {
                headers: formdataHeader,
                method: id ? "PATCH" : "POST",
                body: formData
            });
            shouldKick(res);

            const data = await res.json();
            if (res?.status != 201 && data?.status !== 'success') {
                throw new Error(data?.message);
            }
            
            // CLEAR FIELDS AND SET RESPONSE MESSAGE
            handleClearFields();
            setResponse({ status: "success", message: data?.message });
            if(!ismodal && !id) {
                console.log(id)
                setShowConfetti(true);
            }

            // MODIFY THE STORE IN THE COOKIE, IF NEW
            if(isnew) handleStore(data?.data?.store);
            
            const timing = isnew ? 2000 : 1000
            setTimeout(function () {
                handleFetchMyStoreProducts()
                handleFetchMyStoreDiscounts()
                if (isnew || ismodal) {
                    close();
                } else {
                    navigate(-1);
                }
            }, timing);

        } catch (err) {
            const message = handleFetchError(err?.message)
            setResponse({ status: "error", message });
        } finally {
            setLoading(false)
        }
    }


    return (
        <React.Fragment>
            {/* SET COLLECTION */}
            {showModal.collection && (
                createPortal(
                    <Drawer
                        title="Create Collection" setClose={() => handleToggleModal("collection")}
                    >
                        <CollectionFormSm close={() => handleToggleModal("collection")} />
                    </Drawer>,
                    document.body
                )
            )}

            {/* SET VARIATION OPTION */}
            {showModal.variation && (
                createPortal(
                    <BgSimple setClose={() => {
                        handleToggleModal("variation");
                        setSeletedVariationId("")
                    }}>
                        <VariantOptions
                            id={seletedVariationId}
                            setId={setSeletedVariationId}
                            options={variationOptions}
                            setOptions={setVariationOptions}
                            closeVariantModal={() => {
                                handleToggleModal("variation");
                                setSeletedVariationId("")
                            }}
                        />
                    </BgSimple>,
                    document.body
                )
            )}

            {/* ADD VARIATION IMAGE */}
            {showModal.addImage && (
                createPortal(
                   <BgSimple setClose={() => handleToggleModal("addImage")}>
                        <VariationImage
                            images={images}
                            setImages={setImages}
                            variations={variations}
                            setVariations={setVariations}
                            selectedId={seletedVariationId}
                            setSelectedId={setSeletedVariationId}
                            closeModal={() => handleToggleModal("addImage")}
                        />
                    </BgSimple>,
                    document.body
                )
            )}

            {/* DELETE PRODUCT VARIATION */}
            {showModal.deleteVaraition && (
                createPortal(
                    <Delete
                        text="" title=""
                        close={() => handleToggleModal("deleteVaraition")} 
                        fn={handleDeleteVariation}
                    />,
                    document.body
                )
            )}

            {/* DELETE MULTIPLE PRODUCT VARIATION */}
            {showModal.deleteMultipleVariation && (
                createPortal(
                    <Delete
                        text={`Delete ${selectedRowsId?.length || 1} selected Variations`} title=""
                        close={() => handleToggleModal("deleteMultipleVariation")} 
                        fn={handleDeleteMultipleVariation}
                    />,
                    document.body
                )
            )}

            <AddPageUI
                pageTitle={`${id ? "Edit" : "Upload"} Product`}
                pageIcon={<LuTags />}
                close={close} isnew={isnew}
                ismodal={ismodal}
                mainLoader={loading}
                response={response}
                handleClear={handleClearFields}
                handleSubmit={handleSubmitProduct}
                confetti={showConfetti}
                hasExplainer={width <= 500 && !id}
                btnBelow={width < 750}
            >
                <form
                    className="product__upload--container" onSubmit={e => e.preventDefault()}
                    style={(width > 750 && productData.hasVariation) ? { gridTemplateColumns: "1fr", margin: "0 auto", maxWidth: "75rem", marginTop: width > 600 ? "4rem" : "0" } : {}}
                >
                    {width < 400 && <Line border={1.4} />}

                    <div className='left--container containers'>
                        <div className="card form">
                            <div className="section--heading">
                                {/* <h2>Product Details</h2> */}
                                <span className='flex-align-center' style={{ justifyContent: "space-between" }}>
                                    <h2>Product Details</h2>
                                    {(width > 500 && !id) && (
                                        <button className="form--add" onClick={() => {}}>
                                            <IoPlayCircleOutline />
                                            See how to Create Products
                                        </button>
                                    )}
                                </span>
                                {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                            </div>

                            <div className="form--item">
                                <label htmlFor="name" className="form--label">Title <Asterisk /></label>
                                <input type="text" name="name" id="name" value={productData.name} onChange={handleProductDataChange} className="form--input" placeholder='White Flat Shoe - Big Size 39, 42' />
                                <span className="form--error-message">
                                    {(!productData.name && productFormErrors.name) && productFormErrors.name}
                                </span>
                            </div>

                            <div className="form--item">
                                <label className="form--label">Product Images (Min 1 & Max {maxImageAmount}) <Asterisk /></label>

                                <MultipleImageUploadInput images={images} productId={fetchedProduct?._id || null} handleChange={handleOnChangeImage} setResponse={setResponse} setLoading={setLoading} />

                                <span className="form--error-message">
                                    {(images?.length < 1 && productFormErrors.images) && productFormErrors.images}
                                </span>
                            </div>

                            <div className="form--item">
                                <label htmlFor="short-des" className="form--label">Short Description</label>
                                <textarea type="text" name="shortDescription" id="short-des" value={productData.shortDescription} onChange={handleProductDataChange} className="form--input" placeholder='Unisex and big fitting.' />
                            </div>

                            <div className="form--item">
                                <label htmlFor="" className="form--label">Product Description <Asterisk /></label>
                                <QuillEditor value={description} setValue={setDescription} />
                                <span className="form--error-message">
                                    {(!description && productFormErrors.description) && productFormErrors.description}
                                </span>
                            </div>

                            <div className="form--item">
                                <label htmlFor="category" className="form--label">Collection <Asterisk /></label>
                                <MainDropdownSelect title="Collection" options={collections} field="name" value={productCollection} setValue={setProductCollection} multiple={true} noDataLabel="No collection found!" loading={loader && loader?.collection} />
                                <span className="form--error-message">
                                    {(productCollection.length < 1 && productFormErrors.productCollection) && productFormErrors.productCollection}
                                </span>

                                <button className='form--add' onClick={() => handleToggleModal("collection")}>
                                    <AiOutlinePlus />
                                    <p>Create New Collection</p>
                                </button>
                            </div>
                        </div>

                        {(width > 750 && !productData?.hasVariation) && (
                            <div className="page__section--actions" style={{ marginTop: "1.4rem" }}>
                                {id ? (
                                    <button className='button clear--button' onClick={() => navigate(-1)}>Cancel</button>
                                ) : (
                                    <button className='button clear--button' onClick={handleClearFields}>Clear Fields</button>
                                )}
                                <button className='button submit--button' disabled={loading} onClick={handleSubmitProduct}>Submit</button>
                            </div>
                        )}
                    </div>

                    {width < 400 && <Line border={1.4} />}

                    <div className='right--container containers'>
                        <div className="card form">
                            <div className="section--heading">
                                <h2>Pricings, Inventory & Variations</h2>
                                {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                            </div>

                            <div className="form--item" style={{ gap: "1rem" }}>
                                <label className="form--label">Is this a Physical Product?</label>

                                <div className="form--item-flex" style={{ gap: "1.8rem", flexWrap: "wrap" }}>
                                    <div className="radio--item" onClick={() => setProductData({ ...productData, isPhysical: true })}>
                                        <RadioInput active={productData?.isPhysical} />
                                        <span className="radio--text">Yes, It is</span>
                                    </div>

                                    <div className="radio--item" onClick={() => setProductData({ ...productData, isPhysical: false })}>
                                        <RadioInput active={!productData?.isPhysical} />
                                        <span className="radio--text">No, This is a Digital product.</span>
                                    </div>
                                </div>
                            </div>

                            {productData?.isPhysical && (
                                <div className="form--item" style={{ gap: "1rem" }}>
                                    <label className="form--label">Does this product have variations, e.g: Sizes, Colors, etc?</label>

                                    <div className="form--item-flex" style={{ gap: "1.8rem" }}>
                                        <div className="radio--item" onClick={() => setProductData({ ...productData, hasVariation: false })}>
                                            <RadioInput active={!productData?.hasVariation} />
                                            <span className="radio--text">No, It doesnt</span>
                                        </div>

                                        <div className="radio--item" onClick={() => setProductData({ ...productData, hasVariation: true })}>
                                            <RadioInput active={productData?.hasVariation} />
                                            <span className="radio--text">Yes, It does.</span>
                                        </div>
                                    </div>

                                    {/* VARIATION, PRICE AND QUANTITY INFO */}
                                    {(productData?.hasVariation) && (
                                        <Info text="Each product variation will have its own price and quantity!" />
                                    )}
                                </div>
                            )}

                            {/* VARIATION */}
                            {(productData?.hasVariation) && (
                                <React.Fragment>
                                    {variationOptions?.length > 0 && (
                                        <div className='form--variation'>
                                            <Line border={1.4} where="Top" value="1rem" />
                                            <h3 className='form--title'>Variation Options</h3>
                                            
                                            {variationOptions.map((option, i) => (
                                                <div className="form--item" key={i}>
                                                    <p className='form--label'>{option?.label?.trim()}:</p>
                                                    <div className="flex-align-center" style={{ gap: ".8rem", flexWrap: "wrap", width: "100%" }}>
                                                        {option?.values?.length > 0 && option?.values?.map(val => (
                                                            <p className='variation-tab'>{val}</p>
                                                        ))}

                                                        <span className='table--actions' style={{ marginLeft: "auto" }}>
                                                            <button className='table--btn' onClick={() => {
                                                                setSeletedVariationId(option?.id);
                                                                handleToggleModal("variation")
                                                            }}><RiEdit2Line /></button>
                                                            <button className='table--btn' onClick={() => handleDeleteVariantOption(option?.id)}><RiDeleteBin5Line /></button>
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}


                                    {/* ADD VARIATION BUTTON */}
                                    <div className="form--item">
                                        <button className="form--add" onClick={() => handleToggleModal("variation")}>
                                            <AiOutlinePlus />
                                            <p>Add {variationOptions.length > 0 ? "more options" : "variation options like size or color"}</p>
                                        </button>

                                        <span className="form--error-message">
                                            {(variationOptions.length < 1 && productFormErrors.variationOptions) && productFormErrors.variationOptions}
                                        </span>
                                    </div>


                                    {variationOptions?.length > 0 && (
                                        <div className='form--variation' style={{ maxWidth: "30rem", minWidth: "100%" }}>
                                            <Line border={1.4} where="Top" value="1rem" />
                                            <h3 className='form--title'>Product Variations</h3>

                                            {selectedRowsId.length > 0 && (
                                                <span className='flex-align-center' style={{ flexWrap: "wrap" }}>
                                                    <p style={{ fontSize: "1.4rem" }}>Selected Items: <span className='value'>{formatNumber(selectedRowsId?.length)}</span></p>
                                                    <div className='flex-align-center' style={{ flexWrap: "wrap" }}>
                                                        <button className='table--btn delete' onClick={() => handleToggleModal("deleteMultipleVariation")}>Delete Selected</button>
                                                        <button className='table--btn' onClick={() => handleToggleModal("inputPrice")}>Input Bulk Price</button>
                                                        <button className='table--btn' onClick={() => handleToggleModal("inputQuantity")}>Input Bulk Quantity</button>
                                                    </div>
                                                </span>
                                            )}

                                            <DataTable
                                                selectableRows
                                                data={variations}
                                                columns={variation_columns}
                                                onSelectedRowsChange={({ _, __, selectedRows }) => {
                                                    const ids = [];
                                                    selectedRows?.map(row => ids.push(row?.id));
                                                    setSelectedRowsId(ids);
                                                }}
                                                customStyles={variation_columns_Styles}
                                                noDataComponent={<p style={{ padding: "1rem", fontSize: "1.4rem" }}>No variation to show!</p>}
                                            />
                                        </div>
                                    )}
                                </React.Fragment>
                            )}

                            {/* PRICES GRID, IF NO VARIATION */}
                            {(!productData?.hasVariation) && (
                                <React.Fragment>
                                    <div className="form--grid">
                                        <div className="form--item">
                                            <label htmlFor="" className="form--label">Price per item <Asterisk /></label>
                                            <CurrencyInput
                                                id="price"
                                                name="price"
                                                className="form--input"
                                                placeholder={`${currency}15,000`}
                                                prefix={currency}
                                                decimalsLimit={2}
                                                value={productData.price}
                                                onValueChange={(value, name, _) => setProductData({ ...productData, [name]: value })}
                                            />
                                            <span className="form--error-message">
                                                {(!productData.price && productFormErrors.price) && productFormErrors.price}
                                            </span>
                                        </div>

                                        <div className="form--item">
                                            <label htmlFor="cost-price" className="form--label">Cost per item (optional)</label>
                                            <CurrencyInput
                                                id="cost-price"
                                                name="itemCost"
                                                className="form--input"
                                                placeholder={`${currency}10,000`}
                                                prefix={currency}
                                                decimalsLimit={2}
                                                value={productData.itemCost}
                                                onValueChange={(value, name, _) => setProductData({ ...productData, [name]: value })}
                                            />
                                            <span className="form--error-message">
                                                {productFormErrors.itemCost && productFormErrors.itemCost}
                                            </span>
                                        </div>


                                        <div className="form--item">
                                            <label htmlFor="quantity" className="form--label">Stock Quantity (optional)</label>
                                            <CurrencyInput
                                                id="quantity"
                                                name="stockAmount"
                                                className="form--input"
                                                placeholder="Quantity"
                                                prefix="Qty. "
                                                decimalsLimit={0}
                                                value={productData.stockAmount}
                                                onValueChange={(value, name, _) => setProductData({ ...productData, [name]: value })}
                                            />
                                        </div>
                                    </div>


                                    <div className="form--item">
                                        <label htmlFor="discount-price" className="form--label">Discount Type (optional)</label>
                                        <div className="form--clicks" style={width < 500 ? { gridTemplateColumns: "repeat(2, 1fr)" } : {}}>
                                            <div className={`form--click ${productData.discountType == "no-discount" ? 'is-selected' : ''}`} onClick={() => setProductData({ ...productData, discountType: "no-discount" })}
                                            >No Discount<span></span>
                                            </div>
                                            <div className={`form--click ${productData.discountType == "percentage" ? 'is-selected' : ''}`} onClick={() => setProductData({ ...productData, discountType: "percentage" })}
                                            >Percentage {width < 750 && "%"}<span></span>
                                            </div>
                                            <div className={`form--click ${productData.discountType == "fixed-price" ? 'is-selected' : ''}`} onClick={() => setProductData({ ...productData, discountType: "fixed-price" })}
                                            >Fixed Value {width < 750 && currency}<span></span>
                                            </div>
                                        </div>
                                    </div>

                                    {(productData.discountType !== "no-discount") && (
                                        <div className="form--item">
                                            <label htmlFor="discount-price" className="form--label">Discount Price <Asterisk /></label>
                                            <CurrencyInput
                                                id="discount-price"
                                                name="discountValue"
                                                className="form--input"
                                                placeholder={productData.discountType == "fixed-price" ? `${currency}7,000` : "20%"}
                                                value={productData.discountValue}
                                                {...(productData.discountType == "fixed-price") ? { prefix: currency } : { suffix: "%" }}
                                                decimalsLimit={productData.discountType == "fixed-price" ? 2 : 0}
                                                onValueChange={(value, name, _) => setProductData({ ...productData, [name]: value })}
                                            />
                                            <span className="form--error-message">
                                                {productFormErrors.discountValue && productFormErrors.discountValue}
                                            </span>
                                        </div>
                                    )}
                                </React.Fragment>
                            )}

                            {/* IF PHYSICAL, UNITS AND MOQ */}
                            {productData?.isPhysical && (
                                <React.Fragment>
                                    <div className="form--item">
                                        <label className="form--label">Unit (optional) </label>
                                        <MainDropdownSelect title="Unit" options={units} field="name" value={unit} setValue={setUnit} noDataLabel="No Unit data!" />
                                    </div>


                                    {/* MOQ / MAXIMUM AND MINIMUM ORDER QUANTITY */}
                                    <div className="form--item">
                                        <label htmlFor="MOQ" className="form--label flex">
                                            Minimum Order Quantity 
                                            <Switch color='#ff7a49' size="small" checked={showMOQ} onClick={() => setShowMOQ(!showMOQ)} />
                                        </label>
                                        {showMOQ && (
                                            <input type="number" name="MOQ" id="MOQ" value={productData.MOQ} onChange={handleProductDataChange} className="form--input" placeholder="Set a minimum order quantity" />
                                        )}
                                        <Info text="Minimum Order Quantity or MOQ is the minimum amount of a product that can be ordered in a single purchase" />
                                    </div>
                                </React.Fragment>
                            )}

                            <div className="form--item-flex" onClick={() => setProductData({ ...productData, isHidden: !productData.isHidden })}>
                                <div id="checkbox" className={productData.isHidden ? 'is-selected' : ''}>
                                    {productData.isHidden && <FaCheck />}
                                </div>
                                <label className='form--text flex' style={{ fontSize: '1.24rem', fontWeight: '500', gap: '.4rem', width: "auto" }}>Hide this Product</label>
                            </div>
                        </div>

                        {(width > 750 && productData?.hasVariation) && (
                            <div className="page__section--actions" style={{ marginTop: "1.4rem" }}>
                                {id ? (
                                    <button className='button clear--button' onClick={() => navigate(-1)}>Cancel</button>
                                ) : (
                                    <button className='button clear--button' onClick={handleClearFields}>Clear Fields</button>
                                )}
                                <button className='button submit--button' disabled={loading} onClick={handleSubmitProduct}>Submit</button>
                            </div>
                        )}
                    </div>
                </form>
            </AddPageUI>
        </React.Fragment>
    )
}








{/* <div className="form--item">
    <label htmlFor='status' className='form--label flex' style={{ flexDirection: "row"}}>
        Set Status 
        <span className={`status--dot ${productData.status}`}></span>
    </label>
    <select name="status" id='status' value={productData.status} className="form--select" onChange={handleProductDataChange}>
        <option value="published">Publish</option>
        <option value="draft">Draft</option>
    </select>
</div> */}