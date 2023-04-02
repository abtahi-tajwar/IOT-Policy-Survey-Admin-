import React from 'react'
import Loading from '../assets/loading.gif'

function Loader({ isLoading, children }) {
  return (
    <>
        {!isLoading ? 
            children : 
            <div className='loading'>
                <img src={Loading} height="50px" />
            </div>
        }
    </>
  )
}

export default Loader