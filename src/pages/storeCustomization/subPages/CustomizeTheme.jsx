import React from 'react'
import { useNavigate } from 'react-router-dom'
import StoreCustom from "../../../components/pageComponents/StoreCustom"


export default function CustomizeTheme() {
    const navigate = useNavigate();

    return (
        <StoreCustom isnew={false} close={() => navigate(-1)} />
    )
}