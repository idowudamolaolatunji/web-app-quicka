import React from 'react'
import { useFetchedContext } from '../../context/FetchedContext'
import { useAuthContext } from '../../context/AuthContext';
import CurrencyInput from 'react-currency-input-field';
import CurrencyInputField from '../form/CurrencyInputField';

function ProductFilterForm() {
    const { currency } = useAuthContext();
    const { collections, handleFetchUserStoreCollections } = useFetchedContext();

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
                <CurrencyInputField />
                <CurrencyInputField />
            </div>
        </div>
    </div>
  )
}

export default ProductFilterForm