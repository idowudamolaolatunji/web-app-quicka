import React from 'react';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function QuillEditor({ value, setValue, placeholder="Description" }) {
    return (
        <ReactQuill
            theme="snow"
            value={value}
            onChange={setValue}
            placeholder={placeholder}
        />
    )
}