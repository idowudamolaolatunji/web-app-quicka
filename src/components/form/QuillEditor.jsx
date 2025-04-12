import React from 'react';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function QuillEditor({ value, setValue }) {
    return (
        <ReactQuill
            theme="snow"
            value={value}
            onChange={setValue}
            placeholder='Description'
        />
    )
}