import React from 'react';
import { BsPatchExclamation } from 'react-icons/bs';
import { GiRadarDish } from 'react-icons/gi';
import { useFetchedContext } from '../../context/FetchedContext';
import { HiCursorArrowRays } from 'react-icons/hi2';

export default function ErrorComponent({ text="Oops, Error!", customStyle }) {
    const { errorType } = useFetchedContext();

    return (
        <div className={`error empty--box ${errorType == "rate-exceeded" ? "warning" : "danger"}`} style={customStyle}>
            <span>{
                errorType == "general-error" ? <BsPatchExclamation />
                : errorType == "internet-error" ? <GiRadarDish />
                : <HiCursorArrowRays />
            }</span>
            <p>{text}</p>
        </div>
    )
}