import React from 'react'
import { useAuthContext } from '../../context/AuthContext'
import fav_demo from '../../assets/images/resources/logo-demo.png'


function FaviconInput({ name="logo", logoPreview, handleLogoChange }) {
    const { store } = useAuthContext()

  return (
    <div className="form--favicon">
        <span><img src={logoPreview || (store?.favicon?.url ? store?.favicon?.url : fav_demo)} alt="brand logo" /></span>

        <div className='form--item'>
            <input type='file' id={name} name={name} onChange={handleLogoChange} accept="image/*" />

            <label htmlFor={name} className='form--upload-btn'>{(store?.favicon?.url || logoPreview) ? "Change" : "Upload"} Favicon</label>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.4' }}>
                Recommended size <i className='value'> 16px x 16px</i> <br />PNG or JPG up to 150kb.
            </p>
        </div>
    </div>
  )
}

export default FaviconInput