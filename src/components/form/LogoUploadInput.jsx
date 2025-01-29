import React from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { useAuthContext } from '../../context/AuthContext'
import logo_demo from '../../assets/images/dummy_items/demo_quicka_logo.png'


function LogoUploadInput({ name="logo", logoPreview, handleLogoChange, handleLogoRemove }) {
    const { store } = useAuthContext()

  return (
    <div className="form--element">
        <span><img src={logoPreview || (store?.storeLogo?.url ? store?.storeLogo?.url : logo_demo)} alt="brand logo" /></span>

        <div className='form--item'>
            <input type='file' id={name} name={name} onChange={handleLogoChange} accept="image/*" />

            <div className="flex" style={{ flexDirection: "row" }}>
                <label htmlFor={name} className='form--upload-btn'>{(store?.storeLogo?.url || logoPreview) ? "Change" : "Upload"} Logo</label>

                {logoPreview && <button onClick={handleLogoRemove} className='form--upload-btn' style={{ padding: ".45rem .68rem", fontSize: "2rem", color: "red", backgroundColor: "#eee" }}><AiOutlineDelete /></button>}
            </div>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.4' }}>
                Recommended size <i className='value'> 256x256</i> <br />PNG, SVG or JPG up to 2MB.
            </p>
        </div>
    </div>
  )
}

export default LogoUploadInput