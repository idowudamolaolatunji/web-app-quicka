import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AddPageUI from '../../ui/PageUI/AddPageUI';
import Line from '../../components/elements/Line';
import Asterisk from '../../components/elements/Asterisk';
import { useWindowSize } from 'react-use';
import { RiCoupon3Line } from 'react-icons/ri';
import { couponSelectionTypeData } from '../../utils/data.jsx';
import { useAuthContext } from '../../context/AuthContext';
import { useFetchedContext } from '../../context/FetchedContext';
import { nanoid } from 'nanoid';
import Info from '../../components/elements/Info.jsx';
import CurrencyInput from 'react-currency-input-field';
import CollapsibleDiv from 'react-collapsible';
import { MdArrowDropDown } from 'react-icons/md';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';
import ProductPreview from '../../components/layout/ProductPreview.jsx';
import MainDropdownSelect from '../../components/form/MainDropdownSelect.jsx';
import { FaCheck } from 'react-icons/fa';


function index() {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { currency } = useAuthContext();
    const { products, collections } = useFetchedContext()

    //////////////////////////////////////////////////////////
    const [isGenerated, setIsGenerated] = useState(false);
    const [selection, setSelection] = useState([couponSelectionTypeData[1] || []]);
    const [couponProducts, setCouponProducts] = useState([]);
    const [couponCollection, setCouponCollection] = useState([]);
    
    const [loading, setLoading] = useState({ code: false, main: false });
    const [response, setResponse] = useState({ status: null, message: null });
    const [showConfetti, setShowConfetti] = useState(false);

    const [showAdvance, setShowAdvance] = useState()
    const [couponFormErrors, setCouponFormErrors] = useState({})
    const [couponData, setCouponData] = useState({
        title: "",
        couponValue: null,
        couponType: "none",
        couponItems: [],
        maxDiscountValue: null,
        couponGroup: "all",
        setvalidity: true,

        startDate: "",
        endDate: "",
        couponCode: "",
    
        minimumCartValue: null,
        maxPerUser: null,
        maxTotalUsage: null,
    })

    const handleClearFields = function () {
        setCouponData({
            title: "",
            couponValue: null,
            couponType: "none",
            couponItems: [],
            maxDiscountValue: null,
            couponGroup: "all",
            setvalidity: true,
            startDate: "",
            endDate: "",
            couponCode: "",
            minimumCartValue: null,
            maxPerUser: null,
            maxTotalUsage: null,
        });

        setIsGenerated(false)
    }

    const handleGenerateCode = function() {
        setIsGenerated(false)
        setLoading({ ...loading, code: true });

        const code = nanoid(8).replace("_", "");
        setCouponData({ ...couponData, couponCode: code })
        
        setTimeout(() => {
            setLoading({ ...loading, code: false })
            setIsGenerated(true)
        }, 500)
    }

    const handleChangeCouponGroup = function(value, tag) {
        setSelection(value);
        setCouponData({ ...couponData, couponGroup: tag })
    }

    // REMOVE A PRODUCT FROM THE DISCOUNT PRODUCTS ARRAY
    const handleRemoveItem = function(id) {
        setCouponProducts(prev => prev?.filter(product => product._id !== id))
    }

    const handleChangeCouponData = function(e) {
        const { name, value } = e.target;
        setCouponData({ ...couponData, [name]: value });
    }

    const handleResetResponse = function () {
        setResponse({ status: null, message: null });
    }

    useEffect(function () {
        document.title = "Quicka | Create Coupon";
        window.scrollTo(0, 0);
    }, []);

    useEffect(function() {
        setCouponData({
            ...couponData,
            couponCode: couponData.couponCode.replace(/[^a-zA-Z0-9\s]/g, '').replace(/^\s+/, '')
        })
    }, [couponData.couponCode])


    async function handleSubmitCoupon() {}


    return (
        <AddPageUI
            pageTitle="Create Coupon"
            pageIcon={<RiCoupon3Line />}
            close={() => navigate(-1)}
            ismodal={false}
            mainLoader={loading.main}
            response={response}
            handleClear={handleClearFields}
            handleSubmit={handleSubmitCoupon}
            confetti={showConfetti}
        >
            <form className="product__upload--container" onSubmit={e => e.preventDefault()} 
                style={{ gridTemplateColumns: "1fr", margin: "0 auto", maxWidth: "75rem", marginTop: width > 600 ? "4rem" : "0" }}    
            >
                {width < 400 && <Line border={1.4} />}

                <div className="card form">
                    <div className="section--heading">
                        <h2>Coupon Details</h2>
                        {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                    </div>

                    
                    <div className="form--grid">
                        <div className="form--item">
                            <label htmlFor="title" className="form--label">Coupon Title <Asterisk /></label>
                            <input type="text" name="title" id="title" value={couponData.title} onChange={handleChangeCouponData} className="form--input" placeholder="Coupon title, Example: 10% Discount" />
                            <span className="form--error-message">
                                {couponFormErrors.title && couponFormErrors.title}
                            </span>
                        </div>

                        <div className="form--item">
                            <label htmlFor="couponCode" className="form--label">Coupon Code <Asterisk /></label>

                            <div className={"form--input-box"}>
                                <input type="text" name="couponCode" id="couponCode" value={loading.code ? "Loading.." : couponData.couponCode.slice(0, 8).toUpperCase()} onChange={handleChangeCouponData} className="form--input" placeholder="Create an 8 Character Code" disabled={isGenerated} />

                                <span className='url--box coupon' onClick={() => !isGenerated ? handleGenerateCode() : ""} style={isGenerated ? { cursor: "auto" } : {}}>{!isGenerated ? "Generate Code" : "Generated!"}</span>

                            </div>
                            <span className="form--error-message">
                                {couponFormErrors.couponCode && couponFormErrors.couponCode}
                            </span>
                        </div>
                    </div>

                    
                    <div className="form--item">
                        <label htmlFor="discount-price" className="form--label">Coupon Type <Asterisk /></label>
                        <div className="form--clicks" style={width < 500 ? { gridTemplateColumns: "repeat(2, 1fr)" } : {}}>
                            <div className={`form--click ${couponData.couponType == "none" ? 'is-selected' : ''}`} onClick={() => setCouponData({ ...couponData, couponType: "none" })}
                            >None<span></span>
                            </div>
                            <div className={`form--click ${couponData.couponType == "percentage" ? 'is-selected' : ''}`} onClick={() => setCouponData({ ...couponData, couponType: "percentage" })}
                            >Percentage (%)<span></span>
                            </div>
                            <div className={`form--click ${couponData.couponType == "fixed-price" ? 'is-selected' : ''}`} onClick={() => setCouponData({ ...couponData, couponType: "fixed-price" })}
                            >Fixed Value ({currency})<span></span>
                            </div>
                        </div>
                    </div>

                    {(couponData.couponType !== "none") && (
                        <React.Fragment>
                            <div className={couponData.couponType == "percentage" ? "form--grid" : ""}>
                                <div className="form--item">
                                    <label htmlFor="discount-price" className="form--label">Discount {couponData.couponType == "percentage" ? "Percentage (%)" : `Price (${currency})`} <Asterisk /></label>
                                    <CurrencyInput
                                        id="discount-price"
                                        name="discountValue"
                                        className="form--input"
                                        placeholder={couponData.couponType == "fixed-price" ? `${currency}7,000` : "20%"}
                                        value={couponData.couponValue}
                                        {...(couponData.couponType == "fixed-price") ? { prefix: currency } : { suffix: "%" }}
                                        decimalsLimit={couponData.couponType == "fixed-price" ? 2 : 0}
                                        onValueChange={(value, name, _) => setCouponData({ ...couponData, [name]: value })}
                                    />
                                    <span className="form--error-message">
                                        {couponFormErrors.couponValue && couponFormErrors.couponValue}
                                    </span>
                                </div>


                                {couponData.couponType == "percentage" && (
                                    <div className="form--item">
                                        <label htmlFor="discount-price" className="form--label">Maximum Discount Amount (optional)</label>
                                        <CurrencyInput
                                            id="discount-price"
                                            name="maxDiscountValue"
                                            className="form--input"
                                            placeholder={`${currency}7,000`}
                                            value={couponData.maxDiscountValue}
                                            prefix={currency}
                                            decimalsLimit={0}
                                            onValueChange={(value, name, _) => setCouponData({ ...couponData, [name]: value })}
                                        />
                                        <span className="form--error-message">
                                            {couponFormErrors.couponValue && couponFormErrors.couponValue}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <CollapsibleDiv trigger={
                                <button className='form--add' style={{ margin: "-1rem 0 1rem"}}>
                                    <p>Set Extras</p> <BiChevronDown  />
                                </button>
                            } triggerWhenOpen={
                                <button className='form--add' style={{ margin: "-1rem 0 1rem"}}>
                                    <p>Close Extras</p> <BiChevronUp  />
                                </button>
                            } containerElementProps={{ border: "1px solid red" }}>

                                <div className="form--grid">
                                    <div className="form--item">
                                        <label htmlFor="maxTotalUsage" className="form--label">Maximum Coupon Usage (optional)</label>
                                        <CurrencyInput
                                            id="maxTotalUsage"
                                            name="maxTotalUsage"
                                            className="form--input"
                                            placeholder="Maximum usage eg: 10"
                                            value={couponData.maxTotalUsage}
                                            decimalsLimit={0}
                                            onValueChange={(value, name, _) => setCouponData({ ...couponData, [name]: value })}
                                        />
                                        <span className="form--error-message">
                                            {couponFormErrors.maxTotalUsage && couponFormErrors.maxTotalUsage}
                                        </span>
                                    </div>

                                    <div className="form--item">
                                        <label htmlFor="maxPerUser" className="form--label">Max Use Per Customer (optional)</label>
                                        <CurrencyInput
                                            id="maxPerUser"
                                            name="maxPerUser"
                                            className="form--input"
                                            placeholder="Max per user eg: 1"
                                            value={couponData.maxPerUser}
                                            decimalsLimit={0}
                                            onValueChange={(value, name, _) => setCouponData({ ...couponData, [name]: value })}
                                        />
                                        <span className="form--error-message">
                                            {couponFormErrors.maxPerUser && couponFormErrors.maxPerUser}
                                        </span>
                                    </div>
                                </div>

                            </CollapsibleDiv>

                        </React.Fragment>

                    )}

                </div>



                {width < 400 && <Line border={1.4} />}

                <div className="card form">
                    <div className="section--heading">
                        <h2 style={{ textTransform: "none" }}>Coupon product(s) and Validity </h2>
                        {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                    </div>

                    <div className="form--item">
                        <label htmlFor="name" className="form--label">Selection Type</label>

                        <MainDropdownSelect title="group" options={couponSelectionTypeData} field="label" value={selection} setValue={(data) => handleChangeCouponGroup(data, data[0]?.value)} clearable={false} searchable={false} />

                        <Info text={`Coupon will apply to ${couponData.couponGroup == "all" ? "all products" : couponData.couponGroup == "collections" ? "selected collection" : "selected product(s)"} and only when in cart!`} />
                    </div>

                    {(couponData.couponGroup == "bundle" || couponData.couponGroup == "single") && (
                        <div className="form--item">
                            <label htmlFor="name" className="form--label">Product(s) <Asterisk /></label>

                            <MainDropdownSelect title="Product" options={products} field="name" value={couponProducts} setValue={setCouponProducts} noDataLabel="No product found!" multiple={couponData.couponGroup == "bundle" ? true : false} />

                            <span className="form--error-message">
                                {couponFormErrors.couponProducts && couponFormErrors.couponProducts}
                            </span>

                            {couponProducts?.length > 0 && (
                                <div className="product--quantity-grid smaller">
                                    {couponProducts?.map((product) => (
                                        <ProductPreview
                                            product={product}
                                            removeItem={handleRemoveItem}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}


                    {couponData.couponGroup == "collections" && (
                        <div className="form--item">
                            <label htmlFor="category" className="form--label">Collection <Asterisk /></label>
                            <MainDropdownSelect title="Collection" options={collections} field="name" value={couponCollection} setValue={setCouponCollection} multiple={true} noDataLabel="No collection found!" />
                            <span className="form--error-message">
                                {couponFormErrors.couponCollection && couponFormErrors.couponCollection}
                            </span>
                        </div>
                    )}

                    <div className="form--item">
                        <div className="form--item-flex" onClick={() => setCouponData({ ...couponData, setvalidity: !couponData.setvalidity })}>
                            <div id="checkbox" className={couponData.setvalidity ? 'is-selected' : ''}>
                                {couponData.setvalidity && <FaCheck />}
                            </div>
                            <label className='form--text' style={{ fontSize: '1.24rem', fontWeight: '500' }}>Set Validity Period</label>
                        </div>
                        <Info text="How long this discount is valid for" />
                    </div>


                    {couponData.setvalidity && (
                        <div className="form--grid">
                            <div className="form--item">
                                <label htmlFor="startDate" className="form--label">Start Date <Asterisk /></label>
                                <input type="datetime-local" name="startDate" id="startDate" value={couponData.startDate} onChange={handleChangeCouponData} className="form--input" min={new Date().toISOString().slice(0, 16)} />
                                <span className="form--error-message">
                                    {couponFormErrors.startDate && couponFormErrors.startDate}
                                </span>
                            </div>

                            <div className="form--item">
                                <label htmlFor="endDate" className="form--label">End Date <Asterisk /></label>
                                <input type="datetime-local" name="endDate" id="endDate" value={couponData.endDate} onChange={handleChangeCouponData} className="form--input" min={couponData.startDate ? new Date(new Date(couponData.startDate).getTime() + 86400000).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)} />
                                <span className="form--error-message">
                                    {couponFormErrors.endDate && couponFormErrors.endDate}
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
