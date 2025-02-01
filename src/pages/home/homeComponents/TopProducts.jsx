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


const datePeriods = [
    { value: 'this-week', title: 'This Week' },
    { value: 'this-month', title: 'This Month' },
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
    const { products, error } = useFetchedContext();

    const threshold = 2;
    const amount = 3;
    const topProducts = products.filter(product => product?.trackInventory && product.soldAmount >= threshold).sort((a, b) => b.soldAmount - a.soldAmount).slice(0, amount);
    const itemLength = topProducts?.length
    const noError = (!error.order || !error.product)

    const [period, setPeriod] = useState("this-week");


    return (
        <div className='card top-product-section'>
            <div className="section--top" style={ width < 450 ? { flexDirection: "column", textAlign: "center", width: "100%", alignItems: "center" } : {} }>
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
                {(!noError && products?.length < 1) && (
                    <ErrorComponent text={error?.product} />
                )}

                {itemLength > 0 && topProducts?.map(product => (
                    <ProductFigure product={product} key={product._id} />
                ))}

                {(itemLength > 0 && width <= 450) && (
                    <span style={{ marginTop: "1.5rem" }}>
                        <Info text="Only items you choose to track inventory is shown" />
                    </span>
                )}

                {((!topProducts || topProducts.length < 1) && noError) && (
                    <Empty text="best selling product yet!" />
                )}
            </div>

        </div>
    )
}

export default TopProducts