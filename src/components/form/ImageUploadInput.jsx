import React, { useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { GoStack } from 'react-icons/go';
import { IoCloudDownloadOutline } from 'react-icons/io5'

function ImageUploadInput({ text, name="image", preview, handleChange, height, handleRemove }) {
    const [dragging, setDragging] = useState(false);

    // WHEN DRAGGED OVER THE CONTAINER
    const handleOnDragOver = function(e) {
        e.preventDefault();
        setDragging(true);
    };
    
    // WHEN DRAGGED OUT THE CONTAINER
    const handleOnDragLeave = function() {
        setDragging(false);
    };
    
    // WHEN DROPPED THE CONTAINER
    const handleOnDrop = function(e) {
        e.preventDefault();
        setDragging(false);
        // CREATE AN EVEN OBJECT, WITH THE FILE AND THE NAME, CUS THE HANDLE CHANGE EXPECTS.
        const event = { target: { name, files: [e.dataTransfer.files[0]] } };
        handleChange(event)
    };


      

    return (
        <span
            onDrop={handleOnDrop}
            onDragLeave={handleOnDragLeave}
            onDragOver={handleOnDragOver}
            style={height}
            className={`upload form--img-box ${preview ? "img--preview" : ""} ${dragging ? "dropping" : ""}`}
            // className={['upload', 'form--img-box', preview && 'img--preview', dragging && 'dropping' ].join(' ')}
        >
            <input type='file' id='form-image' name={name} accept="image/*" onChange={handleChange} />
            <label htmlFor='form-image'>
                {preview ? (
                    <img src={preview} alt='Preview' className='img' style={height} />
                ) : (
                    !dragging ? (
                        <React.Fragment>
                            <IoCloudDownloadOutline style={{ color: '#ff7a49' }} />
                            <h3>Drop or Click to upload image</h3>
                            <p>{text}</p>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <GoStack style={{ color: '#ff7a49' }} />
                            <h3>Drop image</h3>
                        </React.Fragment>
                    )
                )}
            </label>

            {preview && <button onClick={handleRemove} className='form--upload-btn delete'><AiOutlineDelete /></button>}
        </span>
    )
}

export default ImageUploadInput