import React, { useState } from 'react'
import SelectAutoWidthDropdown from '../../../components/form/SelectAutoWidthDropdown';

import Empty from '../../../components/layout/Empty';
import { useWindowSize } from 'react-use';
import { useFetchedContext } from '../../../context/FetchedContext';
import { truncateString } from '../../../utils/helper';
import TooltipUI from '../../../components/layout/TooltipUI';
import { useNavigate } from 'react-router-dom';
import ErrorComponent from '../../../components/layout/ErrorComponent';
import Info from '../../../components/elements/Info';
import { ImInfo } from 'react-icons/im';
import moment from 'moment';


const datePeriods = [
    { value: 'week', title: 'This Week' },
    { value: 'month', title: 'This Month' },
];


function ProductFigure({ product }) {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { soldAmount, stockAmount, images, name } = product;
    const totalStock = (soldAmount + stockAmount);

    const percentageSold = ((soldAmount / totalStock) * 100).toFixed(0)

    return (
        <figure className='top-product--figure' onClick={() => navigate(`/dashboard/products/${product.productId}`)}>
            <img className='top-product--img' src={images[0]?.url} alt="" />
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

function TopProducts() {
    const { width } = useWindowSize();
    const { orders, products, error } = useFetchedContext();
    /////////////////////////////////////////////////
    const [period, setPeriod] = useState("month");

    const threshold = 1;
    const amountToShow = 3;
    const hasNoError = (!error.order || !error.product)


    const lookupTopProductByDuration = function(period) {
        // I DON'T REALLY UNDERSTAND HOW THIS WORKS, BUT THANKS TO META AI, IT DOES
        const startDate = moment().startOf(period)
        const ordersInPeriod = orders.filter(order => moment(order.orderDate).isSameOrAfter(startDate));
        const productSales = ordersInPeriod.reduce((acc, order) => {
            order.products.forEach(product => {
                const productData = products.find(p => p.name === product.name);
                if (productData?.trackInventory && productData.soldAmount >= threshold) {
                    acc[product.name] = (acc[product.name] || 0) + product.quantity;
                }
            });

            return acc;
        }, {});

        return Object.keys(productSales).sort((a, b) => productSales[b] - productSales[a]).slice(0, amountToShow).map(productName => products.find(product => product.name === productName));
    }

    const topThreeItems = lookupTopProductByDuration(period);
    const itemLength = topThreeItems?.length


    return (
        <div className='card top-product-section'>
            <div className="section--top" style={width < 450 ? { flexDirection: "column", textAlign: "center", width: "100%", alignItems: "center" } : {}}>
                <div className="section--heading">
                    <h2>Best Selling Products </h2>
                    <p>Top <label className='value'>{itemLength || ""}</label> item{itemLength != 1 ? "s" : ""} that {itemLength != 1 ? "are" : "is"} selling the most. 

                        {width > 450 && (
                            <TooltipUI title="Only items you choose to track inventory is shown">
                                <span style={{ cursor: "pointer", marginLeft: ".6rem" }}><ImInfo /></span>
                            </TooltipUI>
                       )}
                    </p>
                </div>

                <SelectAutoWidthDropdown menus={datePeriods} period={period} setPeriod={setPeriod} />
            </div>

            <div className='top-product--container'>
                {(!hasNoError && products?.length < 1) && (
                    <ErrorComponent text={error?.product} />
                )}

                {((!topThreeItems || itemLength < 1) && hasNoError) && (
                    <Empty text={`best selling product yet${itemLength < 1 ? ", this "+period : ""}!`} />
                )}

                {itemLength > 0 && topThreeItems?.map(product => (
                    <ProductFigure product={product} key={product._id} />
                ))}

                {(itemLength > 0 && width <= 450) && (
                    <span style={{ marginTop: "1.5rem" }}>
                        <Info text="Only items you choose to track inventory is shown" />
                    </span>
                )}
            </div>

        </div>
    )
}

export default TopProducts