import React, { useState } from 'react'

export default function FileAndMediaUploadInput() {
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
        >
        
        </span>
    )
}
