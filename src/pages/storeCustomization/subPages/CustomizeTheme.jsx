import React from 'react'

import StoreCustom from "../../../components/pageComponents/StoreCustom"
import { useParams } from 'react-router-dom'

function CustomizeTheme() {
  const { id } = useParams();
  
  return (
    <StoreCustom isnew={false} />
  )
}

export default CustomizeTheme