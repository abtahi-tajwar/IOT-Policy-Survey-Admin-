import React from 'react'
import { Button as MuiButton, CircularProgress } from '@mui/material'

function Button({ loading, children, ...props }) {
  return (
    <MuiButton {...props} disabled={loading || props.disabled}>
        {loading ? 
            <CircularProgress size={25} /> : 
            children
        }
    </MuiButton>
  )
}

export default Button