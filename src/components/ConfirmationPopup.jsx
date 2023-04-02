import React from 'react'
import styled from '@emotion/styled'
/**
 * data: {
 *  show: boolean,
 *  text: string,
 *  error: boolean
 * }
 */
function ConfirmationPopup({ data }) {
    const [isVisible, setIsVisible] = React.useState(data.show)
    React.useEffect(() => {
        setIsVisible(data.show)
        setTimeout(() => {
            setIsVisible(false)
        }, 2000)
    }, [data.show])
  return (
    <Wrapper show={isVisible} error={data.error}>
        {data.text}
    </Wrapper>
  )
}
const Wrapper = styled.div`
    height: fit-content !important;
    padding: 20px 40px !important;
    background-color: ${props => !props.error ? '#affab3' : '#faafaf' } !important;
    max-width: 400px;
    position: fixed;
    left: 50%;
    bottom: 40px;
    transition: .2s ease-in;
    z-index: 30002;
    transform: ${props => props.show ? `translateX(-50%)` : `translate(-50%, 200%)`};
`
export default ConfirmationPopup