import React from 'react';
import { BsPatchExclamation } from 'react-icons/bs';
import { MdWifiTetheringErrorRounded } from 'react-icons/md';


export default function ErrorComponent({ text="Oops, Error!", customStyle, type="connection" }) {
    return (
        <div className={`error empty--box ${type == "connection" ? "danger" : "warning"}`} style={customStyle}>
            <span>{(type == "connection") ? <BsPatchExclamation /> : <MdWifiTetheringErrorRounded />}</span>
            <p>{text}</p>
        </div>
    )
}