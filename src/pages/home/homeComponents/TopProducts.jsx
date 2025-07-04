import React, { useState } from 'react'
import SelectAutoWidthDropdown from '../../../components/form/SelectAutoWidthDropdown';

import Empty from '../../../components/layout/Empty';
import { useWindowSize } from 'react-use';
import { useFetchedContext } from '../../../context/FetchedContext';
import { truncateString } from '../../../utils/helper';
import TooltipUI from '../../../components/layout/TooltipUI';
import { useNavigate } from 'react-router-dom';
import ErrorComponent from '../../../components/layout/ErrorComponent';
import moment from 'moment';
import Info from '../../../components/elements/Info';


const datePeriods = [
    { value: 'this-week', title: 'This Week' },
    { value: 'this-month', title: 'This Month' },
    { value: 'this-year', title: 'This Year' },
    { value: 'all-time', title: 'All Time' },
];


function ProductFigure({ product }) {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { soldAmount, stockAmount, mainImageUrl, name } = product;
    const totalStock = (soldAmount + stockAmount);

    const percentageSold = ((soldAmount / totalStock) * 100).toFixed(0)

    return (
        <figure className='top-product--figure' onClick={() => navigate(`/dashboard/products/${product.productId}`)}>
            <img className='top-product--img' src={mainImageUrl} alt="" />
            <figcaption className='top-product--details'>
                <div className='top-product--info'>
                    <TooltipUI placement='top' title={name}>
                        <p className='product--info-text'>
                            {truncateString(name, width < 800 ? 
                            (width < 500 ? (width < 450 ? 20 : 28) : 40) : 15 )}
                        </p>
                    </TooltipUI>

                    <span className='product--info-value'>
                        <TooltipUI placement='top' title={`Sold ${soldAmount} out of ${totalStock}`}>
                            <span className='value'>{soldAmount}/{totalStock}</span> 
                        </TooltipUI>
                        <TooltipUI placement='top' title={<span className='value'>{percentageSold}% Sold</span>}>
                            <span><p className='value'>{percentageSold}</p>%</span>
                        </TooltipUI>
                    </span>
                </div>
                <div className='top-product--scale'><span style={{ width: `${percentageSold}%` }} /></div>
            </figcaption>
        </figure>
    )
}

export default function TopProducts() {
    const { width } = useWindowSize();
    const { orders, products, error } = useFetchedContext();
    /////////////////////////////////////////////////
    const [period, setPeriod] = useState("all-time");

    const threshold = 3;
    const amountToShow = 5;
    const hasNoError = (!error.order || !error.product)


    const lookupTopProductByDuration = function(period) {
        const currentDate = moment();
        let startDate;

        if (period === 'this-week') {
            startDate = currentDate.startOf('week');
        } else if (period === 'this-month') {
            startDate = currentDate.startOf('month');
        } else if (period === 'this-year') {
            startDate = currentDate.startOf('year');
        } else {
            startDate = null; 
        }

        const filteredProducts = products?.filter(product => product.soldAmount >= threshold)?.sort((a, b) => b.soldAmount - a.soldAmount);

        if (startDate) {
            const filteredOrders = orders?.filter(order => moment(order?.orderDate)?.isSameOrAfter(startDate));
            const productIds = filteredOrders?.flatMap(order => order?.products.map(product => product?.name));
            return filteredProducts?.filter(product => productIds?.includes(product?.name))?.slice(0, amountToShow);
        } else {
            return filteredProducts?.slice(0, amountToShow);
        }
    }

    const topItems = lookupTopProductByDuration(period);
    const itemLength = topItems?.length

    return (
        <div className='card top-product-section'>
            <div className="section--top" style={width < 450 ? { flexDirection: "column", textAlign: "center", width: "100%", alignItems: "center" } : {}}>
                <div className="section--heading">
                    <h2>Best Selling Products </h2>
                    <p>Top <label className='value'>{itemLength || ""}</label> item{itemLength != 1 ? "s" : ""} that {itemLength != 1 ? "are" : "is"} selling the most, {period !== "all-time" ? period?.split("-").join(" ") : "of All time"} </p>
                </div>

                <SelectAutoWidthDropdown menus={datePeriods} period={period} setPeriod={setPeriod} />
            </div>

            <div className='top-product--container'>
                {(!hasNoError && products?.length < 1) && (
                    <ErrorComponent text={error?.product} />
                )}

                {((!topItems || itemLength < 1) && hasNoError) && (
                    <Empty text={`best selling product yet${period !== "all-time" ? ", "+period?.split("-").join(" ") : ""}!`} />
                )}

                {itemLength > 0 && topItems?.map(product => (
                    <ProductFigure product={product} key={product._id} />
                ))}

                {hasNoError && (
                    <span style={{ marginTop: "1.5rem" }}>
                        <Info text="Only (5) products that has sold more than 3 items will be shown" />
                    </span>
                )}
            </div>

        </div>
    )
}