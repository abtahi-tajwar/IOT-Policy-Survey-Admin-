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
const DNDList = ({ cards, setCards, onClick }) => {
  {
    // const [cards, setCards] = useState([
    //   {
    //     id: 1,
    //     text: 'Write a cool JS library',
    //   },
    //   {
    //     id: 2,
    //     text: 'Make it generic enough',
    //   },
    //   {
    //     id: 3,
    //     text: 'Write README',
    //   },
    //   {
    //     id: 4,
    //     text: 'Create some examples',
    //   },
    //   {
    //     id: 5,
    //     text: 'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
    //   },
    //   {
    //     id: 6,
    //     text: '???',
    //   },
    //   {
    //     id: 7,
    //     text: 'PROFIT',
    //   },
    // ])
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
                id={index}
                text={card}
                moveCard={moveCard}
                onClick={() => handleClick(index, card)}
                style={{ flex: 1 }}
            />
            {onClick && <Button 
                variant='contained' 
                onClick={() => handleClick(index, card)}
                sx={{ height: '100%', ml: 1 }}
            >Select</Button> }
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
    margin-bottom: 7px;
`


export default DNDList
