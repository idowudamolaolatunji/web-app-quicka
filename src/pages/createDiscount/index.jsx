import React, { useEffect, useState } from 'react'
import { TbBasketDiscount, TbRosetteDiscount } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import AddPageUI from '../../ui/PageUI/AddPageUI';
import Line from '../../components/elements/Line';
import Asterisk from '../../components/elements/Asterisk';
import { useWindowSize } from 'react-use';


function index() {
    const navigate = useNavigate();
    const { width } = useWindowSize();

    //////////////////////////////////////////////////////////
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({ status: null, message: null });
    const [showConfetti, setShowConfetti] = useState(false);

    const [discountFormErrors, setDiscountFormErrors] = useState({})
    const [discountData, setDiscountData] = useState({
        title: "",
    })

    const handleClearFields = function () {
        setDiscountData({

        })
    }

    useEffect(function () {
        document.title = "Quicka | Create Discounts";
        window.scrollTo(0, 0);
    }, []);


    return (
        <AddPageUI
            pageTitle="Create Discount"
            pageIcon={<TbRosetteDiscount />}
            close={() => navigate(-1)}
            ismodal={false}
            mainLoader={loading}
            response={response}
            handleClear={handleClearFields}
            handleSubmit={() => { }}
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
                                <input type="text" name="name" id="name" value={discountData.title} onChange={() => {}} className="form--input" placeholder="" />
                                <span className="form--error-message">
                                    {discountFormErrors.title && discountFormErrors.title}
                                </span>
                            </div>
                            {/* more items here */}
                        </div>
                    </div>

                    <div className='right--container containers'>
                    <div className="card form">
                            <div className="section--heading">
                                <h2>Product Details</h2>
                                {width > 400 && <Line border={1.4} where="Top" value="1rem" />}
                            </div>

                            <div className="form--item">
                                <label htmlFor="name" className="form--label">Title <Asterisk /></label>
                                <input type="text" name="name" id="name" value={discountData.title} onChange={() => {}} className="form--input" placeholder="" />
                                <span className="form--error-message">
                                    {discountFormErrors.title && discountFormErrors.title}
                                </span>
                            </div>
                            {/* more items here */}
                        </div>
                    </div>
                </form>

        </AddPageUI>
    )
}

export default index
