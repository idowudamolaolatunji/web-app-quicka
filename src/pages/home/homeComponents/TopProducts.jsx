import React from 'react'
import SelectAutoWidthDropdown from '../../../components/SelectAutoWidthDropdown';

import img_item from '../../../assets/images/resources/IMG_5336.jpg'
import Empty from '../../../components/Empty';
import { useWindowSize } from 'react-use';
import { useFetchedContext } from '../../../context/FetchedContext';
import { truncateString } from '../../../utils/helper';
import TooltipUI from '../../../components/TooltipUI';

const datePeriods = [
    { value: 'this-week', title: 'This Week' },
    { value: 'this-month', title: 'This Month' },
]

const BASE_URL = import.meta.env.VITE_BASE_URL

function ProductFigure({ product }) {
    const { width } = useWindowSize();
    const { soldAmount, stockAmount, images, name } = product;
    const totalStock = (soldAmount + stockAmount);

    const percentageSold = ((soldAmount / totalStock) * 100).toFixed(0)

    return (
        <figure className='top-product--figure'>
            <img className='top-product--img' src={`${BASE_URL}${images[0]}`} alt="" />
            <figcaption className='top-product--details'>
                <div className='top-product--info'>
                    <p className='product--info-text'>
                        {truncateString(name, width < 800 ? 
                        (width < 500 ? (width < 450 ? 20 : 28) : 40) : 15 )}
                    </p>
                    <span className='product--info-value'>
                        <TooltipUI placement='top' title={`Sold ${soldAmount} out of ${totalStock}`}>
                            <span className='value'>{soldAmount}/{totalStock}</span> 
                        </TooltipUI>
                        <span><p className='value'>{percentageSold}</p>%</span>
                    </span>
                </div>
                <div className='top-product--scale'><span style={{ width: '10%' }} /></div>
            </figcaption>
        </figure>
    )
}

function TopProducts() {
    const { width } = useWindowSize();
    const { products } = useFetchedContext();
    const threshold = 3;

    const topThreeProducts = products.filter(product => product.soldAmount >= threshold).sort((a, b) => b.soldAmount - a.soldAmount).slice(0, 3);

    return (
        <div className='card top-product-section'>
            <div className="section--top" style={ width < 450 ? { flexDirection: "column", textAlign: "center", width: "100%", alignItems: "center" } : {} }>
                <div className="section--heading">
                    <h2>Best Selling Products </h2>
                    <p>Items that are selling most.</p>
                </div>

                <SelectAutoWidthDropdown menus={datePeriods} />
            </div>

            <div className='top-product--container'>

                {topThreeProducts?.length > 0 && topThreeProducts?.map(product => (
                    <ProductFigure product={product} key={product._id} />
                ))}

                {(!topThreeProducts || topThreeProducts.length < 1) && (
                    <Empty text="best selling product yet!" />
                )}
            </div>

        </div>
    )
}

export default TopProducts