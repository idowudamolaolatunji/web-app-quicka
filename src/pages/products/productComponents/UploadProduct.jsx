import React, { useEffect, useState } from 'react'
import { Slider } from '@mui/material';
import Cropper from 'react-easy-crop';
import { useWindowSize } from 'react-use';
import CurrencyInput from 'react-currency-input-field';
import ReactImageUploading from 'react-images-uploading';

import Info from '../../../components/Info';
import Line from '../../../components/Line';
import Asterisk from '../../../components/Asterisk';
import TooltipUI from '../../../components/TooltipUI';
import QuillEditor from '../../../components/QuillEditor';
import SimpleModal from '../../../components/modal/Simple';
import { useAuthContext } from '../../../context/AuthContext';
import { useFetchedContext } from '../../../context/FetchedContext';
import MainDropdownSelect from '../../../components/MainDropdownSelect';

import { LuTags } from 'react-icons/lu';
import { GoStack } from 'react-icons/go';
import { FaCheck } from 'react-icons/fa';
import { RxUpdate } from 'react-icons/rx';
import { PiFrameCorners } from 'react-icons/pi';
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai';
import { IoCloseOutline, IoCloudDownloadOutline, IoTrashBinOutline } from 'react-icons/io5';
import { validateProductForm } from '../../../utils/validationHelper';
import { useNavigate } from 'react-router-dom';
import AddPageUI from '../../pageUIComponents/AddPageUI';


const BASE_API_URL = import.meta.env.VITE_API_URL;

function UploadProduct({ isnew, isModal, close }) {
    const currency = "₦";
    const maxNumber = 4;
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { token, handleUser, handleStore } = useAuthContext();
    const { collections, handleImageUpload, handleFetchUserStoreProducts } = useFetchedContext();

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    }

    const [loading, setLoading] = useState({
        mainLoading: false,
        imageLoading: false
    });

    const [response, setResponse] = useState({
        status: null,
        message: null
    });

    const [cropModal, setCropModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const [showConfetti, setShowConfetti] = useState(false)
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
    });

    const [checks, setChecks] = useState({
        trackInventory: false,
        isPhysical: true,
        isVisible: false,
    });

    const [variations, setVariations] = useState([]);
    const [description, setDescription] = useState('');
    const [productCollection, setProductCollection] = useState([]);
    const [images, setImages] = useState([]);
    const imageFiles = images.map(img => img.file);

    function handleOnChangeImage(imageList, addUpdateIndex) {
        console.log(imageList, addUpdateIndex);
        setImages(imageList);
    };

    function handleEdit(img) {
        setCropModal(true);
        setSelectedImage(img)
    }

    function onCropChange(crop) {
        setCrop(crop)
    }

    function onZoomChange(zoom) {
        console.log(zoom)
        setZoom(Number(zoom))
    }

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    function handleProductDataChange(e) {
        const { name, value } = e?.target;
        console.log(name, value)
        setProductData({
            ...productData,
            [name]: value,
        });
    }

    function handleClearFields() {
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
        setDescription("")
        setProductCollection([])
        setChecks({
            trackInventory: false,
            isPhysical: true,
            isVisible: false,
        });
        setProductFormErrors({});

        setImages([])
        setCropModal(false)
        setSelectedImage(null)
        setCrop({ x: 0, y: 0 })
        setZoom(1)
        setCroppedAreaPixels(null)
    }


    useEffect(function () {
        (!isnew || !isModal) && window.scrollTo(0, 0);
    }, []);


    useEffect(function () {
        const type = productData.discountType;
        console.log(type)
        if (type != "no-discount") {
            setProductData({ ...productData, discount: "" });
        }
    }, [productData.discountType]);


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
            setResponse({ status: "error", message: "Fill up all required fields!" });
            setTimeout(() => setResponse({ status: "", message: "" }), 1500);
            return;
        };

        // SET LOADER
        setResponse({ status: "", message: "" });
        setLoading({ ...loading, mainLoading: true });

        // GET COLLECTION NAMES
        const names = productCollection.map(collection => collection.name);

        // MAKE REQUEST
        try {
            const res = await fetch(`${BASE_API_URL}/products`, {
                headers,
                method: "POST",
                body: JSON.stringify({
                    ...checks,
                    description,
                    ...productData,
                    price: +productData.price,
                    itemCost: +productData.itemCost,
                    discount: +productData.discount,
                    stockAmount: +productData.stockAmount,
                    productCollection: names,
                })
            });
            if (!res.ok) throw new Error('Something went wrong! Check intenet connection');

            const data = await res.json();

            const { status, message } = data;
            const { product } = data.data;
            if (status !== 'success') throw new Error(message);

            // SET RESPONSE MESSAGE
            if (width < 600) window.scrollY = 0;
            setResponse({ status: "success", message });
            setShowConfetti(true)

            // UPLOAD PRODUCT IMAGES
            const url = `products/upload-image/${product._id}`
            await handleImageUpload(imageFiles, url);

            window.scrollTo(0, 0);
            handleClearFields();

            // MODIFY THE USER OBJECT AND STORE IN THE COOKIE
            // const { store, owner } = data.useful.data;
            // handleStore(store);
            // handleUser(owner);

            setTimeout(function () {
                if (isnew || isModal) close();
                else navigate(-1)
            }, 3000);
            handleFetchUserStoreProducts()

        } catch (err) {
            setResponse({ status: "error", message: err.message });
        } finally {
            setLoading({ ...loading, mainLoading: false })
        }
    }


    return (
        <>
            <AddPageUI
                PageTitle="Upload Product"
                pageIcon={<LuTags />}
                close={close} isnew={isnew}
                isModal={isModal}
                mainLoader={loading.mainLoading}
                response={response}
                handleClear={handleClearFields}
                handleSubmit={handleCreateProduct}
                confetti={showConfetti}
            ></AddPageUI>


            <form className="product__upload--container" onSubmit={e => e.preventDefault()}>
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

                            <ReactImageUploading
                                multiple
                                value={images}
                                maxNumber={maxNumber}
                                dataURLKey="data_url"
                                acceptType={["jpg", "png", "jpeg"]}
                                onChange={handleOnChangeImage}
                            >
                                {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps
                                }) => (
                                    <div className='form--image'>
                                        {(imageList.length > 2 && width > 600) && (
                                            <button type='button' style={{ margin: '-3.4rem 0 .6rem auto' }} onClick={onImageRemoveAll}>Remove All Images <IoCloseOutline /></button>
                                        )}

                                        {imageList?.length < 1 && (
                                            <div onClick={onImageUpload} className={`form--img-box ${isDragging ? 'dropping' : ''}`} {...dragProps}>
                                                {isDragging ? (
                                                    <span className='img--container'>
                                                        <GoStack />
                                                        <h3>Drop It</h3>
                                                    </span>
                                                ) : (
                                                    <span className='img--container' {...dragProps}>
                                                        <IoCloudDownloadOutline style={{ color: '#ff7a49' }} />
                                                        <h3>Click to upload or Drag n drop Image</h3>
                                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro, cumque.</p>
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {imageList.length > 0 && (
                                            <div className='img--grid'>
                                                {imageList?.map((image, index) => (
                                                    <div key={index} className="img--item">
                                                        <img src={image.data_url} />
                                                        <div className="img--item-btns">
                                                            <TooltipUI placement='bottom' title="Change Image">
                                                                <button onClick={() => onImageUpdate(index)}><RxUpdate /> </button>
                                                            </TooltipUI>
                                                            <TooltipUI placement='bottom' title="Remove Image">
                                                                <button onClick={() => onImageRemove(index)}><IoTrashBinOutline /></button>
                                                            </TooltipUI>
                                                            <TooltipUI placement='bottom' title="Crop Image">
                                                                <button onClick={() => handleEdit(image.data_url)}><PiFrameCorners /> </button>
                                                            </TooltipUI>
                                                        </div>
                                                    </div>
                                                ))}

                                                {imageList.length < maxNumber && (
                                                    <div onClick={onImageUpload} className={`form--img-box ${isDragging ? 'dropping' : ''}`} {...dragProps}>
                                                        {isDragging ? (
                                                            <span className='img--container'>
                                                                <GoStack />
                                                                <h3>Drop It</h3>
                                                            </span>
                                                        ) : (
                                                            <span className='img--container' {...dragProps}>
                                                                <IoCloudDownloadOutline />
                                                                <p>Click or drop more!</p>
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {(imageList.length > 2 && width < 600) && (
                                            <button type='button' style={{ marginTop: '1rem' }} onClick={onImageRemoveAll}>Remove All Images <IoCloseOutline /></button>
                                        )}
                                    </div>
                                )}
                            </ReactImageUploading>
                            <span className="form--error-message">
                                {productFormErrors.images && productFormErrors.images}
                            </span>
                        </div>

                        <div className="form--item">
                            <label htmlFor="short-des" className="form--label">Short Description</label>
                            <input type="text" name="shortDescription" id="short-des" value={productData.shortDescription} onChange={handleProductDataChange} className="form--input" placeholder='Lorem ipsum dolor sit amet consectetur.' />
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

                            <button className='form--add'>
                                <AiOutlinePlus />
                                <p>Create Collection</p>
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
                                    placeholder="₦15,000"
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
                                    placeholder="₦10,000"
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
                            <div className="form--clicks" style={width < 500 ? { gridTemplateColumns: "repeat(2, 1fr)" } : { gridTemplateColumns: "repeat(3, 1fr)" }}>
                                <div className={`form--click ${productData.discountType == "no-discount" ? 'is-selected' : ''}`} onClick={() => setProductData({ ...productData, discountType: "no-discount" })}
                                >No Discount<span></span>
                                </div>
                                <div className={`form--click ${productData.discountType == "percentage" ? 'is-selected' : ''}`} onClick={() => setProductData({ ...productData, discountType: "percentage" })}
                                >Percentage {width < 750 && "%"}<span></span>
                                </div>
                                <div className={`form--click ${productData.discountType == "fixed-price" ? 'is-selected' : ''}`} onClick={() => setProductData({ ...productData, discountType: "fixed-price" })}
                                >Fixed Price {width < 750 && "₦"}<span></span>
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
                                    placeholder={productData.discountType == "fixed-price" ? "₦7,000" : "20%"}
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
                                <label className='form--text' style={{ fontSize: '1.24rem', fontWeight: '500' }}>Track Inventory</label>
                            </div>
                        </div>

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

                    </div>


                    {width < 400 && <Line border={1.4} />}


                    <div className="card form">
                        <div className="section--heading">
                            <div className="flex" style={{ justifyContent: "space-between", flexDirection: "row" }}>
                                <h2>Product Status</h2>
                                <span className={`status--dot ${productData.status}`}></span>
                            </div>
                            {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                        </div>

                        <div className="form--item">
                            <label htmlFor='status' className='form--label'>Set Status</label>
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

                        <div className="form--item">
                            <button className="form--add">
                                <AiOutlinePlus />
                                <p>Add options like size or color</p>
                            </button>
                        </div>

                    </div>
                </div>
            </form>

            {cropModal && (
                <SimpleModal setClose={setCropModal} title="Crop Image" icon={<AiOutlineClose />}>
                    <div className='crop--container' style={{ height: width < 600 ? 250 : 300, background: "#333" }}>
                        <Cropper
                            image={selectedImage}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={onCropChange}
                            onCropComplete={onCropComplete}
                            onZoomChange={onZoomChange}
                        />
                    </div>

                    <div className="controls">
                        <div className="form--item" style={{ gap: 0, marginTop: '1rem' }}>
                            <label className="form--label">Zoom</label>
                            <Slider sx={{ color: '#ff7a49', width: "50%" }} max={3} min={1} step={0.1} value={zoom} onChange={(e) => onZoomChange(e.target.value)} />
                        </div>
                        <div className="button-area">
                            {/* <button onClick={onCancel}>Cancel</button>
                            <button onClick={onResetImage}>Reset</button>
                            <button onClick={onCrop}>Crop</button> */}
                            <button onClick={() => setCropModal(false)}>Cancel</button>
                            <button>Reset</button>
                            <button>Crop</button>
                        </div>
                    </div>
                </SimpleModal>
            )}
        </>
    )
}

export default UploadProduct