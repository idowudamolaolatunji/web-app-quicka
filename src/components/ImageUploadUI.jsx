import React from 'react'
import { IoCloudDownloadOutline } from 'react-icons/io5'

function ImageUploadUI({ text, name="image", preview, handleChange, height }) {
    return (
        <span className={`upload form--img-box ${preview ? "img--preview" : ""} `} style={height}>
            <input type='file' id='form-image' name={name} accept="image/*" onChange={handleChange} />
            <label htmlFor='form-image'>
                {preview ? (
                    <img src={preview} alt='Preview' className='img' style={height} />
                ) : (
                    <>
                        <IoCloudDownloadOutline style={{ color: '#ff7a49' }} />
                        <h3>Click to upload image</h3>
                        <p>{text}</p>
                    </>
                )}
            </label>
        </span>
    )
}

export default ImageUploadUI