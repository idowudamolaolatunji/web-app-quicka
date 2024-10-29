import React from 'react'
import { IoCloudDownloadOutline } from 'react-icons/io5'

function ImageUploadUI({ preview, handleChange }) {
    return (
        <span className={`upload form--img-box ${preview ? "img--preview" : ""} `}>
            <input type='file' id='form-image' name='image' accept="image/*" onChange={handleChange} />
            <label htmlFor='form-image'>
                {preview ? (
                    <img src={preview} alt='Preview' className='img' />
                ) : (
                    <>
                        <IoCloudDownloadOutline style={{ color: '#ff7a49' }} />
                        <h3>Click to upload image</h3>
                        <p>Recommend format (png, jpeg, jpg)</p>
                    </>
                )}
            </label>
        </span>
    )
}

export default ImageUploadUI