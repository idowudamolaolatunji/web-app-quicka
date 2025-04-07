import React, { useState } from 'react'
import { useAuthContext } from '../../context/AuthContext'
import fav_demo from '../../assets/images/dummy_items/demo_quicka_logo.png'
import CustomAlert from '../layout/CustomAlert'


export default function FaviconInput({ preview, handleChange }) {
    const { store } = useAuthContext();
    const [response, setResponse] = useState({ status: "", message: "" });

    const handleClick = function () {
        if (store?.subscriptionType == "paid") return;
        setResponse({ status: "error", message: "Only for paid users" });

        setTimeout(() => {
            setResponse({ status: "", message: "" });
        }, 3000);
    }

    return (
        <React.Fragment>
            {(response.status || response.message) && (
                <CustomAlert type={response.status} message={response.message} />
            )}

            <div className="form--favicon">
                <span><img src={preview || (store?.favicon?.url ? store?.favicon?.url : fav_demo)} alt="brand logo" /></span>

                <div className='form--item'>
                    {store?.subscriptionType == "paid" && (
                        <input type='file' id="favicon" name="favicon" onChange={handleChange} accept="image/*" />
                    )}

                    <label htmlFor="favicon" className='form--upload-btn' onClick={handleClick}>
                        {(store?.favicon?.url || preview) ? "Change" : "Upload"} Favicon
                    </label>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.4' }}>
                        Recommended size <i className='value'> 16px x 16px</i> <br />PNG or JPG up to 150kb.
                    </p>
                </div>
            </div>
        </React.Fragment>
    )
}