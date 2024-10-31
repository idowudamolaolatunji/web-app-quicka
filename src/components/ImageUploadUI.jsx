import React from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { IoCloudDownloadOutline } from 'react-icons/io5'

function ImageUploadUI({ text, name="image", preview, handleChange, height, handleRemove }) {
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

            {preview && <button onClick={handleRemove} className='form--upload-btn delete'><AiOutlineDelete /></button>}
        </span>
    )
}

export default ImageUploadUI