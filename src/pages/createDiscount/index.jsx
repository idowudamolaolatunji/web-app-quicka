import React, { useEffect, useState } from 'react'
import { TbBasketDiscount, TbRosetteDiscount } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import AddPageUI from '../../ui/PageUI/AddPageUI';
import Line from '../../components/elements/Line';
import Asterisk from '../../components/elements/Asterisk';
import { useWindowSize } from 'react-use';
import CurrencyInput from 'react-currency-input-field';
import { useAuthContext } from '../../context/AuthContext';
import { useFetchedContext } from '../../context/FetchedContext';
import MainDropdownSelect from '../../components/form/MainDropdownSelect';
import ProductPreview from '../../components/layout/ProductPreview';
import { discountSelectionTypeData } from "../../utils/data.jsx";
import { FaCheck } from 'react-icons/fa';
import Info from '../../components/elements/Info.jsx';


function index() {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { currency } = useAuthContext();
    const { products, } = useFetchedContext()

    //////////////////////////////////////////////////////////
    const [selection, setSelection] = useState([discountSelectionTypeData[1] || []]);
    const [discountProducts, setDiscountProducts] = useState([]);
    
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({ status: null, message: null });
    const [showConfetti, setShowConfetti] = useState(false);

    const [discountFormErrors, setDiscountFormErrors] = useState({})
    const [discountData, setDiscountData] = useState({
        title: "",
        discountValue: null,
        discountType: "no-discount",
        maxDiscountValue: null,
        selectionType: "product-bundle",
        setperiod: true,
        startDate: "",
        endDate: ""
    })

    const handleClearFields = function () {
        setDiscountData({
            title: "",
            discountValue: null,
            discountType: "no-discount",
            maxDiscountValue: null,
            selectionType: "product-bundle",
            setperiod: true,
            startDate: "",
            endDate: ""

        })
    }

    const handleChangeSelectionType = function(value, tag) {
        setSelection(value);
        setDiscountData({ ...discountData, selectionType: tag })
    }

    // REMOVE A PRODUCT FROM THE DISCOUNT PRODUCTS ARRAY
    const handleRemoveItem = function(id) {
        setDiscountProducts(prev => prev?.filter(product => product._id !== id))
    }

    const handleChangeDiscountData = function(e) {
        const { name, value } = e.target;
        setDiscountData({ ...discountData, [name]: value });
    }

    const handleResetResponse = function () {
        setResponse({ status: null, message: null });
    }


    useEffect(function () {
        document.title = "Quicka | Create Discounts";
        window.scrollTo(0, 0);
    }, []);


    async function handleSubmitDiscount() {}


    return (
        <AddPageUI
            pageTitle="Create Discount"
            pageIcon={<TbRosetteDiscount />}
            close={() => navigate(-1)}
            ismodal={false}
            mainLoader={loading}
            response={response}
            handleClear={handleClearFields}
            handleSubmit={handleSubmitDiscount}
            confetti={showConfetti}
        >
            <form className="product__upload--container" onSubmit={e => e.preventDefault()} 
                style={{ gridTemplateColumns: "1fr", margin: "0 auto", maxWidth: "75rem", marginTop: width > 600 ? "4rem" : "0" }}    
            >
                {width < 400 && <Line border={1.4} />}

                <div className="card form">
                    <div className="section--heading">
                        <h2>Discount Details</h2>
                        {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                    </div>

                    <div className="form--item">
                        <label htmlFor="name" className="form--label">Discount Title <Asterisk /></label>
                        <input type="text" name="name" id="name" value={discountData.title} onChange={handleChangeDiscountData} className="form--input" placeholder="Discount title, Example: Sales Discount" />
                        <span className="form--error-message">
                            {discountFormErrors.title && discountFormErrors.title}
                        </span>
                    </div>

                    <div className="form--item">
                        <label htmlFor="discount-price" className="form--label">Discount Type <Asterisk /></label>
                        <div className="form--clicks" style={width < 500 ? { gridTemplateColumns: "repeat(2, 1fr)" } : {}}>
                            <div className={`form--click ${discountData.discountType == "no-discount" ? 'is-selected' : ''}`} onClick={() => setDiscountData({ ...discountData, discountType: "no-discount" })}
                            >No Discount<span></span>
                            </div>
                            <div className={`form--click ${discountData.discountType == "percentage" ? 'is-selected' : ''}`} onClick={() => setDiscountData({ ...discountData, discountType: "percentage" })}
                            >Percentage (%)<span></span>
                            </div>
                            <div className={`form--click ${discountData.discountType == "fixed-price" ? 'is-selected' : ''}`} onClick={() => setDiscountData({ ...discountData, discountType: "fixed-price" })}
                            >Fixed Value ({currency})<span></span>
                            </div>
                        </div>
                    </div>


                    {(discountData.discountType !== "no-discount") && (
                        <div className={discountData.discountType == "percentage" ? "form--grid" : ""}>
                            <div className="form--item">
                                <label htmlFor="discount-price" className="form--label">Discount {discountData.discountType == "percentage" ? "Percentage (%)" : `Price (${currency})`} <Asterisk /></label>
                                <CurrencyInput
                                    id="discount-price"
                                    name="discountValue"
                                    className="form--input"
                                    placeholder={discountData.discountType == "fixed-price" ? `${currency}7,000` : "20%"}
                                    value={discountData.discountValue}
                                    {...(discountData.discountType == "fixed-price") ? { prefix: currency } : { suffix: "%" }}
                                    decimalsLimit={discountData.discountType == "fixed-price" ? 2 : 0}
                                    onValueChange={(value, name, _) => setDiscountData({ ...discountData, [name]: value })}
                                />
                                <span className="form--error-message">
                                    {discountFormErrors.discountValue && discountFormErrors.discountValue}
                                </span>
                            </div>


                            {discountData.discountType == "percentage" && (
                                <div className="form--item">
                                    <label htmlFor="discount-price" className="form--label">Maximum Discount Amount (optional)</label>
                                    <CurrencyInput
                                        id="discount-price"
                                        name="maxDiscountValue"
                                        className="form--input"
                                        placeholder={`${currency}7,000`}
                                        value={discountData.maxDiscountValue}
                                        prefix={currency}
                                        decimalsLimit={0}
                                        onValueChange={(value, name, _) => setDiscountData({ ...discountData, [name]: value })}
                                    />
                                    <span className="form--error-message">
                                        {discountFormErrors.discountValue && discountFormErrors.discountValue}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                    
                </div>
                
                {width < 400 && <Line border={1.4} />}

                <div className="card form">
                    <div className="section--heading">
                        <h2 style={{ textTransform: "none" }}>Discounted Product(s) and Validity </h2>
                        {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                    </div>

                    <div className="form--item">
                        <label htmlFor="name" className="form--label">Selection Type</label>

                        <MainDropdownSelect title="group" options={discountSelectionTypeData} field="label" value={selection} setValue={(data) => handleChangeSelectionType(data, data[0]?.value)} clearable={false} searchable={false} />

                        <Info text={`${discountData.selectionType == "all" ? "All" : "Only selected"} products would be added to this discount`} />
                    </div>

                    {discountData.selectionType == "product-bundle" && (
                        <div className="form--item">
                            <label htmlFor="name" className="form--label">Product(s) <Asterisk /></label>

                            <MainDropdownSelect title="Product" options={products} field="name" value={discountProducts} setValue={setDiscountProducts} noDataLabel="No product found!" multiple={true} />

                            <span className="form--error-message">
                                {discountFormErrors.discountProducts && discountFormErrors.discountProducts}
                            </span>

                            {discountProducts?.length > 0 && (
                                <div className="product--quantity-grid smaller">
                                    {discountProducts?.map((product) => (
                                        <ProductPreview 
                                            product={product}
                                            removeItem={handleRemoveItem}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}


                    <div className="form--grid">
                        <div className="form--item-flex" onClick={() => setDiscountData({ ...discountData, setperiod: !discountData.setperiod })}>
                            <div id="checkbox" className={discountData.setperiod ? 'is-selected' : ''}>
                                {discountData.setperiod && <FaCheck />}
                            </div>
                            <label className='form--text' style={{ fontSize: '1.24rem', fontWeight: '500' }}>Set Validity Period</label>
                            {width > 800 && <Info text="How long this discount is valid for" />}
                        </div>
                    </div>


                    {discountData.setperiod && (
                        <div className="form--grid">
                        <div className="form--item">
                            <label htmlFor="startDate" className="form--label">Start Date <Asterisk /></label>
                            <input type="datetime-local" name="startDate" id="startDate" value={discountData.startDate} onChange={handleChangeDiscountData} className="form--input" placeholder="" />
                            <span className="form--error-message">
                                {discountFormErrors.startDate && discountFormErrors.startDate}
                            </span>
                        </div>

                        <div className="form--item">
                            <label htmlFor="endDate" className="form--label">End Date <Asterisk /></label>
                            <input type="datetime-local" name="endDate" id="endDate" value={discountData.endDate} onChange={handleChangeDiscountData} className="form--input" placeholder="" />
                            <span className="form--error-message">
                                {discountFormErrors.endDate && discountFormErrors.endDate}
                            </span>
                        </div>
                    </div>
                    )}
                </div>
            </form>
        </AddPageUI>
    )
}

export default index
