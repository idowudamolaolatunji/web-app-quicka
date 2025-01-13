import React from 'react'
import { useFetchedContext } from '../../context/FetchedContext'
import { useAuthContext } from '../../context/AuthContext';
import CurrencyInput from 'react-currency-input-field';

function ProductFilterForm() {
    const { store } = useAuthContext();
    const { collections, handleFetchUserStoreCollections } = useFetchedContext();
    const currency = store?.currencies[store?.mainCurrency]?.symbol;

  return (
    <div className='form'>
        <div className="form--item">
            <label htmlFor="" className="form--label">Collection</label>
            <select name="" id="" className='form--select'>
                <option hidden selected>Filter by Collection</option>
                {collections?.length > 0 && collections?.map(collection => (
                    <option value="">{collection?.name}</option>
                ))}
            </select>
        </div>

        <div className="form--item">
            <label htmlFor="" className="form--label">Stock</label>
            <select name="" id="" className='form--select'>
                <option hidden selected>Filter by Stock</option>
                <option>In Stock</option>
                <option>Low Stock</option>
                <option>Out of Stock</option>
            </select>
        </div>

        <div className="form--item">
            <label htmlFor="" className="form--label">Status</label>
            <select name="" id="" className='form--select'>
                <option hidden selected>Filter by Status</option>
                <option>Published</option>
                <option>Draft</option>
            </select>
        </div>

        <div className="form--item">
            <label htmlFor="" className="form--label">Price, ₦</label>
            
            <div className="form--grid">
                <CurrencyInput
                    id="price"
                    name="price"
                    className="form--input"
                    placeholder={`${currency}1,000`}
                    prefix={currency}
                    decimalsLimit={0}
                    onValueChange={(value, name, _) => {}}
                />
                <CurrencyInput
                    id="price"
                    name="price"
                    className="form--input"
                    placeholder={`${currency}100,000`}
                    prefix={currency}
                    decimalsLimit={0}
                    onValueChange={(value, name, _) => {}}
                />
            </div>
        </div>
    </div>
  )
}

export default ProductFilterForm