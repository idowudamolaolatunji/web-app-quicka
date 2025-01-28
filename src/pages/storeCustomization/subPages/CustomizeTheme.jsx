import React from 'react'

import StoreCustom from "../../../components/pageComponents/StoreCustom"
import { useNavigate, useParams } from 'react-router-dom'

function CustomizeTheme() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  return (
    <StoreCustom isnew={false} close={() => navigate(-1)} />
  )
}

export default CustomizeTheme