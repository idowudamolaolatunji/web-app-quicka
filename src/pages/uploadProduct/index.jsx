import React, { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use';
import CurrencyInput from 'react-currency-input-field';

import Info from '../../components/elements/Info';
import Line from '../../components/elements/Line';
import Asterisk from '../../components/elements/Asterisk';
import QuillEditor from '../../components/form/QuillEditor';
import { useAuthContext } from '../../context/AuthContext';
import { useFetchedContext } from '../../context/FetchedContext';
import MainDropdownSelect from '../../components/form/MainDropdownSelect';

import { LuTags } from 'react-icons/lu';
import { FaCheck } from 'react-icons/fa';
import { AiOutlinePlus } from 'react-icons/ai';
import { validateProductForm } from '../../utils/validationHelper';
import { useNavigate, useParams } from 'react-router-dom';
import Drawer from '../../components/modal/Drawer';
import CollectionFormSm from '../../components/pageComponents/CollectionFormSm';
import { createPortal } from 'react-dom';
import { units } from '../../utils/data';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Switch } from '@mui/material';
import AddPageUI from '../../ui/PageUI/AddPageUI';
import MultipleImageUploadInput from '../../components/form/MultipleImageUploadInput';
import isOnline from 'is-online';


const BASE_API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = import.meta.env.VITE_BASE_URL;

function index({ isnew=false, close, ismodal=false }) {
    const navigate = useNavigate();
    const { id } = useParams();

    const { width } = useWindowSize();
    const { headers, shouldKick, handleStore, store } = useAuthContext();
    const { collections, handleFetchError, handleMultipleImageUpload, handleFetchUserStoreProducts, handleFetchUserStoreCollections, handleFetchItem } = useFetchedContext();

    const { currencies, mainCurrency } = store;
    const currency = currencies[mainCurrency]?.symbol;

    //////////////////////////////////////////////////////////
    // FOR EDITTING THE PRODUCT
    const [selectedId, setSelectedId] = useState(null);
    //////////////////////////////////////////////////////////
    const [loading, setLoading] = useState({ mainLoading: false, imageLoading: false });
    const [response, setResponse] = useState({ status: null, message: null });
    const [showConfetti, setShowConfetti] = useState(false)
    const [showModal, setShowModal] = useState({ collection: false, others: false });
    
    const [variations, setVariations] = useState([]);
    const [description, setDescription] = useState('');
    const [productCollection, setProductCollection] = useState([]);
    const [unit, setUnit] = useState([]);
    const [checks, setChecks] = useState({ trackInventory: false, isPhysical: true, isVisible: false, });

    const [productFormErrors, setProductFormErrors] = useState({})
    const [productData, setProductData] = useState({
        name: "",
        shortDescription: "",
        price: null,
        itemCost: null,
        stockAmount: null,
        status: "published",
        discount: null,
        discountType: "no-discount",
        MOQ: "",
    });
    const [showMOQ, setShowMOQ] = useState(false);

    const [images, setImages] = useState([]);
    const imageFiles = images.filter(img => img?.file)?.map(img => img?.file);
    const [indexes, setIndexes] = useState([]);
    // console.log(images, imageFiles, indexes)

    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////
    const handleOnChangeImage = function(imageList, addUpdateIndex) {
        // this here might feel strange in the future, but it helps us keep track of the updated images
        // console.log(imageList, addUpdateIndex);
        if(addUpdateIndex !== undefined) {
            setIndexes((prev) => [...new Set([...prev, addUpdateIndex?.at(0)])])
        }
        setImages(imageList);
    };

    useEffect(function() {

    }, [images])

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
            discount: null,
            stockAmount: null,
            status: "published"
        });
        setVariations([]);
        setDescription("")
        setProductCollection([])
        setChecks({
            trackInventory: false,
            isPhysical: true,
            isVisible: false,
        });
        setProductFormErrors({});
        setImages([])
        
        window.scrollTo(0, 0)
    }


    // HANDLE VARIATION INPUTS
    const handleChangeVariant = function(e, index) {
        const { name, value } = e?.target;
        setVariations(prev => prev.map((item, i) =>
              i === index ? { ...item, [name]: value } : item
            )
        );        
    }

    // ADD ITEM NEW VARIATIONS
    const handleAddVariant = function() {
        const lastVariant = variations[variations.length - 1];

        if (lastVariant && (lastVariant.type === "" || lastVariant.value === "")) {
            setResponse({ status: "error", message: `Variant ${lastVariant?.type == "" ? "type" : "value"} left empty` })
            return setTimeout(() => setResponse({ message: "", status: "" }), 5000);
        }
        
        setVariations([...variations, { type: "", value: "", quantity: "" }]);
    }

    // DELETE ITEM VARIATIONS
    const handleDeleteVariant = function(selectedIndex) {
        setVariations(prev => prev.filter((_, index) => index !== selectedIndex))
    }


    useEffect(function() {
        document.title = "Quicka | Upload new product";

        handleFetchUserStoreCollections()
    }, []);

    useEffect(function () {
        const type = productData.discountType;
        if (type != "no-discount") {
            setProductData({ ...productData, discount: "" });
        }
    }, [productData.discountType]);

    useEffect(function() {
        (async () => {
            if(id) {
                setLoading({...loading, mainLoading: true});
                const fetchedItem = await handleFetchItem("product", id);

                if(fetchedItem) {
                    setLoading({...loading, mainLoading: false})
        
                    setSelectedId(fetchedItem?._id)
                    setProductData({
                        name: fetchedItem?.name || "",
                        shortDescription: fetchedItem?.shortDescription || "",
                        price: fetchedItem?.price || null,
                        itemCost: fetchedItem?.itemCost ||null,
                        discount: fetchedItem?.discount || null,
                        stockAmount: fetchedItem?.stockAmount || null,
                        status: fetchedItem?.status || "published",
                        discountType: fetchedItem?.discountType || "no-discount",
                    });
                    setVariations(fetchedItem?.variations);
                    setDescription(fetchedItem?.description || "")
                    setProductCollection(fetchedItem?.productCollection?.map((collection, i) => (
                        { name: collection, id: i }
                    )))
                    setChecks({
                        trackInventory: fetchedItem?.trackInventory || false,
                        isPhysical: fetchedItem?.isPhysical || true,
                        isVisible: fetchedItem?.isVisible || false,
                    });
                    setImages(fetchedItem?.images?.map(img => (
                        { data_url: `${BASE_URL}/${img}`, }
                    )));
                    setUnit([{ name: fetchedItem?.unit, id: 0 }]);
                }
            }
        })();

    }, [id]);


    async function handleCreateProduct(e) {
        // FORM VALIDATIONS 
        let formData = {
            ...productData,
            productCollection,
            images, description,
            inventory: checks.trackInventory
        }

        const newErrors = validateProductForm(formData);
        setProductFormErrors(newErrors);
        if (Object.keys(newErrors).length >= 1) {
            setResponse({ status: "error", message: "Fill required fields to proceed!" });
            setTimeout(() => setResponse({ status: "", message: "" }), 5000);
            return;
        };

        // SET LOADER
        setResponse({ status: "", message: "" });
        setLoading({ ...loading, mainLoading: true });

        
        // GET COLLECTION NAMES
        const names = productCollection.map(collection => collection.name);
        const itemUnit = unit[0]?.value;
        
        // check if it's firsttime new onboard or old editing
        const end_point = isnew ? "/onboard/product" : id ?`/${selectedId}` : "";
        
        try {
            // CHECK CONNECTION
            const connected = await isOnline();
            if(!connected) throw new Error("Internet Error");
            
            // MAKE REQUEST
            const res = await fetch(`${BASE_API_URL}/products${end_point}`, {
                headers,
                method: id ? "PATCH" : "POST",
                body: JSON.stringify({
                    ...checks,
                    variations,
                    description,
                    ...productData,
                    unit: itemUnit,
                    price: +productData.price,
                    itemCost: +productData.itemCost,
                    discount: +productData.discount,
                    stockAmount: +productData.stockAmount,
                    productCollection: names,
                })
            });
            shouldKick(res);

            const data = await res.json();
            const { status, message } = data;
            const { product } = data.data;
            if (status !== 'success') throw new Error(message);
            
            /////// UPLOAD PRODUCT IMAGES //////////////////
            // IF THERE'S AN ID, THAT MEANS WE ARE EDITTING
            const url = `products/upload-image/${product._id}`;
            if(imageFiles.length >= 1) {
                if(id) {
                    await handleMultipleImageUpload(imageFiles, url, "PATCH", indexes);
                } else {
                    await handleMultipleImageUpload(imageFiles, url, "POST");
                }
            }
            ///////////////////////////////////////////////
            
            // SET RESPONSE MESSAGE
            setResponse({ status: "success", message });
            ismodal || setShowConfetti(true);

            // SCROLL AND CLEAR
            window.scrollTo(0, 0);
            handleClearFields();

            // MODIFY THE STORE IN THE COOKIE, if new
            if(isnew) {
                const { store } = data?.data;
                handleStore(store);
            }

            setTimeout(function () {
                if (isnew || ismodal) close();
                else navigate(-1)
            }, isnew ? 5000 : 3000);
            handleFetchUserStoreProducts()

        } catch (err) {
            const message = handleFetchError(err?.message)
            setResponse({ status: "error", message });
        } finally {
            setLoading({ ...loading, mainLoading: false })
        }
    }


    return (
        <>
            {showModal.collection && (
                createPortal(
                    <Drawer
                        title="Create Collection" 
                        setClose={() => handleToggleModal("collection")}
                    >
                        <CollectionFormSm close={() => handleToggleModal("collection")} />
                    </Drawer>,
                    document.body
                )
            )}

            <AddPageUI
                pageTitle={`${id ? "Edit" : "Upload"} Product`}
                pageIcon={<LuTags />}
                close={close} isnew={isnew}
                ismodal={ismodal}
                mainLoader={loading.mainLoading}
                response={response}
                handleClear={handleClearFields}
                handleSubmit={handleCreateProduct}
                confetti={showConfetti}
            >

                <form className="product__upload--container" onSubmit={e => e.preventDefault()}>
                    {width < 400 && <Line border={1.4} />}

                    <div className='left--container containers'>
                        <div className="card form">
                            <div className="section--heading">
                                <h2>Product Details</h2>
                                {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                            </div>

                            <div className="form--item">
                                <label htmlFor="name" className="form--label">Title <Asterisk /></label>
                                <input type="text" name="name" id="name" value={productData.name} onChange={handleProductDataChange} className="form--input" placeholder='White Flat Shoe - Big Size 39, 42' />
                                <span className="form--error-message">
                                    {productFormErrors.name && productFormErrors.name}
                                </span>
                            </div>

                            <div className="form--item">
                                <label className="form--label">Product Images (Min 1 & Max 4) <Asterisk /></label>

                                <MultipleImageUploadInput images={images} productId={selectedId || null} handleChange={handleOnChangeImage} setResponse={setResponse} />

                                <span className="form--error-message">
                                    {productFormErrors.images && productFormErrors.images}
                                </span>
                            </div>

                            <div className="form--item">
                                <label htmlFor="short-des" className="form--label">Short Description</label>
                                <input type="text" name="shortDescription" id="short-des" value={productData.shortDescription} onChange={handleProductDataChange} className="form--input" placeholder='Unisex and big fitting.' />
                            </div>
                            <div className="form--item">
                                <label htmlFor="" className="form--label">Product Description <Asterisk /></label>
                                <QuillEditor value={description} setValue={setDescription} />
                                <span className="form--error-message">
                                    {productFormErrors.description && productFormErrors.description}
                                </span>
                            </div>

                            <div className="form--item">
                                <label htmlFor="category" className="form--label">Collection <Asterisk /></label>
                                <MainDropdownSelect title="Collection" options={collections} field="name" value={productCollection} setValue={setProductCollection} multiple={true} noDataLabel="No collection found!" />
                                <span className="form--error-message">
                                    {productFormErrors.productCollection && productFormErrors.productCollection}
                                </span>

                                <button className='form--add' onClick={() => handleToggleModal("collection")}>
                                    <AiOutlinePlus />
                                    <p>Create New Collection</p>
                                </button>
                            </div>
                        </div>
                    </div>

                    {width < 400 && <Line border={1.4} />}

                    <div className='right--container containers'>
                        <div className="card form">
                            <div className="section--heading">
                                <h2>Pricings & Inventory</h2>
                                {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                            </div>


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
                                        {productFormErrors.price && productFormErrors.price}
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
                                    >Fixed Price {width < 750 && currency}<span></span>
                                    </div>
                                </div>
                            </div>


                            {(productData.discountType !== "no-discount") && (
                                <div className="form--item">
                                    <label htmlFor="discount-price" className="form--label">Discount Price <Asterisk /></label>
                                    <CurrencyInput
                                        id="discount-price"
                                        name="discount"
                                        className="form--input"
                                        placeholder={productData.discountType == "fixed-price" ? `${currency}7,000` : "20%"}
                                        value={productData.discount}
                                        {...(productData.discountType == "fixed-price") ? { prefix: currency } : { suffix: "%" }}
                                        decimalsLimit={productData.discountType == "fixed-price" ? 2 : 0}
                                        onValueChange={(value, name, _) => setProductData({ ...productData, [name]: value })}
                                    />
                                    <span className="form--error-message">
                                        {productFormErrors.discount && productFormErrors.discount}
                                    </span>
                                </div>
                            )}

                            <div className="form--grid">
                                <div className="form--item-flex" onClick={() => setChecks({ ...checks, isPhysical: !checks.isPhysical })}>
                                    <div id="checkbox" className={checks.isPhysical ? 'is-selected' : ''}>
                                        {checks.isPhysical && <FaCheck />}
                                    </div>
                                    <label className='form--text' style={{ fontSize: '1.24rem', fontWeight: '500' }}>This is a physical product</label>
                                </div>
                                <div className="form--item-flex" onClick={() => setChecks({ ...checks, trackInventory: !checks.trackInventory })}>
                                    <div id="checkbox" className={checks.trackInventory ? 'is-selected' : ''}>
                                        {checks.trackInventory && <FaCheck />}
                                    </div>
                                    <label className='form--text' style={{ fontSize: '1.24rem', fontWeight: '500' }}>Track My Inventory</label>
                                </div>
                            </div>

                            {/*  */}
                            <div className="form--item">
                                <label htmlFor="quantity" className="form--label">Stock Quantity {checks.trackInventory ? <Asterisk /> : "(optional)"}</label>
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
                                <span className="form--error-message">
                                    {productFormErrors.stockAmount && productFormErrors.stockAmount}
                                </span>
                            </div>

                            {/* MOQ / MAXIMUM AND MINIMUM ORDER QUANTITY */}
                            <div className="form--item">
                                <label htmlFor="MOQ" className="form--label flex">
                                    Maximum Order Quantity 
                                    <Switch color='#ff7a49' size="small" checked={showMOQ} onClick={() => setShowMOQ(!showMOQ)} />
                                </label>
                                {showMOQ && (
                                    <input type="number" name="MOQ" id="MOQ" value={productData.MOQ} onChange={handleProductDataChange} className="form--input" placeholder="Set a minimum order quantity" />
                                )}
                                <Info text="What is Maximum Order Quantity?" />
                            </div>

                            <div className="form--item">
                                <label className="form--label">Unit (optional) </label>
                                <MainDropdownSelect title="Unit" options={units} field="name" value={unit} setValue={setUnit} noDataLabel="No Unit data!" />
                            </div>


                            <div className="form--item">
                                <label htmlFor='status' className='form--label flex' style={{ flexDirection: "row"}}>
                                    Set Status 
                                    <span className={`status--dot ${productData.status}`}></span>
                                </label>
                                <select name="status" id='status' value={productData.status} className="form--select" onChange={handleProductDataChange}>
                                    <option value="published">Publish</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </div>

                            {productData.status == "published" && (
                                <div className="form--item-flex" onClick={() => setChecks({ ...checks, isVisible: !checks.isVisible })}>
                                    <div id="checkbox" className={checks.isVisible ? 'is-selected' : ''}>
                                        {checks.isVisible && <FaCheck />}
                                    </div>
                                    <label className='form--text flex' style={{ fontSize: '1.24rem', fontWeight: '500', gap: '.4rem', width: "auto" }}>Hide this Product <Info /></label>
                                </div>
                            )}
                        </div>
                        

                        {width < 400 && <Line border={1.4} />}

                        <div className="card form">
                            <div className="section--heading">
                                <h2>Product Variations</h2>
                                {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                            </div>

                            {variations?.length > 0 && (
                                <div className='form--variation'>
                                    {variations.map((variant, i) => (
                                        <div className='form--variant' key={i}>
                                            <div className='form--item'>
                                                <label htmlFor="variantType" className='form--label'>Option type</label>
                                                <input type='text' name='type' id='variantType' className='form--input' placeholder='Like: color, size, etc' value={variant?.type} onChange={e => handleChangeVariant(e, i)} />
                                            </div>
                                            <div className="form--item">
                                                <label htmlFor="variantVal" className='form--label'>Option value</label>
                                                <input type='text' name='value' id='variantVal' className='form--input' placeholder='Like: red, 34, big, etc' value={variant?.value} onChange={e => handleChangeVariant(e, i)} />
                                            </div>
                                            <div className="form--item">
                                                <label htmlFor="variantQt" className='form--label'>Qt.</label>
                                                <CurrencyInput prefix='Qt.' name='quantity' id='variantQt' className='form--input' placeholder='Qt 1' value={variant?.quantity} onValueChange={(value, name, _) => handleChangeVariant({ target: { name, value } }, i)} />
                                            </div>
                                            <button onClick={() => handleDeleteVariant(i)}><RiDeleteBin5Line /></button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="form--item">
                                <button className="form--add" onClick={handleAddVariant}>
                                    <AiOutlinePlus />
                                    <p>Add {variations.length > 0 ? "more options" : "options like size or color"}</p>
                                </button>
                            </div>

                        </div>
                    </div>
                </form>
            </AddPageUI>
        </>
    )
}

export default index