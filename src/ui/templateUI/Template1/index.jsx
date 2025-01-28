import React from 'react'
import Header from './templateComponents/Header'
import TopHeadline from './templateComponents/TopHeadline'
import TopBanner from './templateComponents/TopBanner'
import CollectionLists from './templateComponents/CollectionLists'
import ProductCard from '../../../components/layout/ProductCard'
import { products } from '../templateData';

import "../style.css"


function index({ logo, color, about, headline, banner, heading, text }) {
    return (
        <div className='store__template'>
            <TopHeadline color={color} headline={headline} />
            <Header Logo={logo} about={about} color={color} />
            <TopBanner banner={banner} text={text} heading={heading} />
            <CollectionLists color={color} />
            <div className="template__products">
                {products?.map(product => <ProductCard product={product} forTemplate={true} key={product.id} />)}
            </div>
        </div>
    )
}

export default index