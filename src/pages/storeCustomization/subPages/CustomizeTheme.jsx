import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import StoreCustom from "../../../components/pageComponents/StoreCustom"


function CustomizeTheme() {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <StoreCustom isnew={false} close={() => navigate(-1)} />
    )
}

export default CustomizeTheme