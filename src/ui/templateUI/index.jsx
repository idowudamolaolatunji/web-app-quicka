import React from 'react'
import Header from './templateComponents/Header'
import "./style.css"
import TopHeadline from './templateComponents/TopHeadline'
import TopBanner from './templateComponents/TopBanner'
import CollectionLists from './templateComponents/CollectionLists'
import ProductCard from '../../components/ProductCard'

import dummy1 from "../../assets/images/dummy_items/1.jpeg"
import dummy2 from "../../assets/images/dummy_items/2.jpeg"
import dummy3 from "../../assets/images/dummy_items/3.jpg"
import dummy4 from "../../assets/images/dummy_items/4.webp"

function index({ logo, color, about, headline, banner, heading, text }) {
  
  const products = [
      { id: 1, name: "Color Black show", images: [dummy1, dummy1] },
      { id: 2, name: "Color Black show", images: [dummy2, dummy1] },
      { id: 3, name: "Color Black show", images: [dummy3, dummy1] },
      { id: 4, name: "Color Black show", images: [dummy4, dummy1] },
  ]

  return (
    <div className='store__template'>
      <TopHeadline color={color} headline={headline} />
      <Header Logo={logo} about={about} color={color} />
      <TopBanner banner={banner} text={text} heading={heading} />
      <CollectionLists color={color} />
      <div className="template__products">
        {products?.map(product => <ProductCard product={product} base={"dummy"} key={product.id} />)}
      </div>
    </div>
  )
}

export default index