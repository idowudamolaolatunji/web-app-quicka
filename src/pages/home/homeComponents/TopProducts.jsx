import React, { useState } from 'react'
import SelectAutoWidthDropdown from '../../../components/SelectAutoWidthDropdown';

import Empty from '../../../components/Empty';
import { useWindowSize } from 'react-use';
import { useFetchedContext } from '../../../context/FetchedContext';
import { truncateString } from '../../../utils/helper';
import TooltipUI from '../../../components/TooltipUI';
import { useNavigate } from 'react-router-dom';
import ErrorComponent from '../../../components/ErrorComponent';

const datePeriods = [
    { value: 'this-week', title: 'This Week' },
    { value: 'this-month', title: 'This Month' },
]

const BASE_URL = import.meta.env.VITE_BASE_URL

function ProductFigure({ product }) {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { soldAmount, stockAmount, images, name } = product;
    const totalStock = (soldAmount + stockAmount);

    const percentageSold = ((soldAmount / totalStock) * 100).toFixed(0)

    return (
        <figure className='top-product--figure' onClick={() => navigate(`/dashboard/products/${product.productId}`)}>
            <img className='top-product--img' src={`${BASE_URL}${images[0]}`} alt="" />
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

    const threshold = 3;
    const topThreeProducts = products.filter(product => product.soldAmount >= threshold).sort((a, b) => b.soldAmount - a.soldAmount).slice(0, 3);
    const noError = (!error.order || !error.product)

    const [period, setPeriod] = useState("");


    return (
        <div className='card top-product-section'>
            <div className="section--top" style={ width < 450 ? { flexDirection: "column", textAlign: "center", width: "100%", alignItems: "center" } : {} }>
                <div className="section--heading">
                    <h2>Best Selling Products </h2>
                    <p>Items that are selling most.</p>
                </div>

                <SelectAutoWidthDropdown menus={datePeriods} period={period} setPeriod={setPeriod} />
            </div>

            <div className='top-product--container'>

                {(!noError && products?.length < 1) && (
                    <ErrorComponent text="Cannot get products, Check Connection" />
                )}

                {topThreeProducts?.length > 0 && topThreeProducts?.map(product => (
                    <ProductFigure product={product} key={product._id} />
                ))}

                {((!topThreeProducts || topThreeProducts.length < 1) && noError) && (
                    <Empty text="best selling product yet!" />
                )}
            </div>

        </div>
    )
}

export default TopProducts