import update from 'immutability-helper'
import { useCallback, useState } from 'react'
import { Card } from './DNDCard'
import { Button, Grid } from '@mui/material'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import styled from '@emotion/styled'
const style = {
  width: '100%',
}
const DNDListExtended = ({ cards, setCards }) => {
  {
    const moveCard = useCallback((dragIndex, hoverIndex) => {
      setCards((prevCards) =>
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex]],
          ],
        }),
      )
    }, [])

    const handleClick = (index, value) => {
        if (onClick) onClick(index, value)
    }
    const renderCard = useCallback((card, index) => {
      return (
        <Wrapper key={index}>
            <Card
                index={index}
                id={card.id}
                text={card.body}
                moveCard={moveCard}
                onClick={() => handleClick(index, card)}
                style={{ flex: 1 }}
                extended
            />
            {card.action}
        </Wrapper>
      )
    }, [])
    return (
    <DndProvider backend={HTML5Backend}>
        <div style={style}>
            {cards.map((card, i) => renderCard(card, i))}
        </div>
    </DndProvider>
    )
  }
}

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 7px;
    border: 1px dashed #989898;
    border-radius: 5px;
    padding: 0px 10px;
`


export default DNDListExtended
