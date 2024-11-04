import { Button, styled } from '@mui/material'
import React from 'react'


const ButtonStyled = styled(Button)(({ theme }) => ({
  padding: 0,
  minWidth: 0,
  width: 'fit-content',
  textTransform: 'inherit',
  fontFamily: "inherit",
  color: "inherit",
  '&:hover': {
    backgroundColor: '#fff0eb !important',
  },
  '&:active': {
    backgroundColor: '#fff0eb',
  }
}));


function DefaultButton({ action, text, customStyle, children }) {
  return (
    <ButtonStyled style={customStyle} onClick={action}>{text || children}</ButtonStyled>
  )
}

export default DefaultButton