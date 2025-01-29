import React from 'react'
import { useAuthContext } from '../../context/AuthContext'
import fav_demo from '../../assets/images/dummy_items/demo_quicka_logo.png'


function FaviconInput({ preview, handleChange }) {
    const { store } = useAuthContext()

  return (
    <div className="form--favicon">
        <span><img src={preview || (store?.favicon?.url ? store?.favicon?.url : fav_demo)} alt="brand logo" /></span>

        <div className='form--item'>
            <input type='file' id="favicon" name="favicon" onChange={handleChange} accept="image/*" />

            <label htmlFor="favicon" className='form--upload-btn'>{(store?.favicon?.url || preview) ? "Change" : "Upload"} Favicon</label>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.4' }}>
                Recommended size <i className='value'> 16px x 16px</i> <br />PNG or JPG up to 150kb.
            </p>
        </div>
    </div>
  )
}

export default FaviconInput