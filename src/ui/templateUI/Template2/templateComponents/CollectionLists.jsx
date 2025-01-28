import React from 'react'

function CollectionLists({ color }) {
    return (
        <div className='template__collection'>
            <p className="collection__item active" style={{ backgroundColor: color || "#aaa" }}>All</p>
            <p className="collection__item">Shirts</p>
            <p className="collection__item">Gowns</p>
            <p className="collection__item">Sneakers</p>
            <p className="collection__item">Hoodies</p>
            <p className="collection__item">Joggers</p>
            <p className="collection__item">Throser</p>
            <p className="collection__item">Plain tees</p>
            <p className="collection__item">Socks</p>
        </div>
    )
}

export default CollectionLists