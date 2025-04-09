import React, { useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { GoStack } from 'react-icons/go';
import { LuPen } from "react-icons/lu";


function ProfileImageUploader({ name="image", preview, handleChange, size="100px", handleRemove }) {
    const [dragging, setDragging] = useState(false);
    const dummy = "https://res.cloudinary.com/dy3bwvkeb/image/upload/v1737549092/pngegg_yirbea.png"
    const styles = { width: size, height: size };

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
            style={styles}
            className={`upload form--img-round  ${preview ? "img--preview" : ""} ${dragging ? "dropping" : ""}`}
        >
            <input type='file' id='form-image' name={name} accept="image/*" onChange={handleChange} />
            <label htmlFor='form-image'>
                <img
                    src={preview || dummy}
                    alt='Preview' className='img'
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                
                <div className="form--img-round-chid">
                    {(!dragging && !preview) && (
                        <React.Fragment>
                            <LuPen style={{ color: '#ff7a49' }} />
                            <h3>Choose image</h3>
                        </React.Fragment>
                    )} 
                    {(dragging && !preview) && (
                        <React.Fragment>
                            <GoStack style={{ color: '#ff7a49' }} />
                            <h3>Drop image</h3>
                        </React.Fragment>
                    )}
                </div>
            </label>

            {preview && (
                <button onClick={handleRemove} className='form--upload-btn delete'><AiOutlineDelete /></button> 
            )}

        </span>
    )
}

export default ProfileImageUploader;
