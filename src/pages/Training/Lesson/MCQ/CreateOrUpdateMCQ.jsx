import React, { useEffect, useRef, useState } from 'react'
import CreateOrEditInstruction from '../CreateOrEditInstruction'
import DNDList from '../../../../components/DNDList/DNDList'
import { Grid, Card } from '@mui/material'
import TextField from '../../../../components/TextField'
import ListInput from '../../../../components/ListInput'
import Select from '../../../../components/Select'

function CreateOrUpdateMCQ({ currentLessonDynamic, setCurrentLessonDynamic, updateMode }) {
  // Update mode placeholder value
  const [currentLesson, setCurrentLesson] = useState({
    "questions": [
      {
        "options": [
            "lamborghini",
            "bughatti",
            "marcedes",
            "ferrari"
        ],
        "image": "",
        "answer": {
            "explanation": "Explanation of why this is the correct answer",
            "index": 0
        },
        "question": "What is the name of your favourite car"
      },
      {
        "options": [
            "Extremely Good",
            "Good",
            "Not Bad",
            "Bad"
        ],
        "image": "",
        "answer": {
            "explanation": "Explanation of why this is the correct answer",
            "index": 0
        },
        "question": "How would you feel if you can go to france?"
      },
      {
        "options": [
            "I don't know",
            "I am illiterate, how would I know?",
            "I read a book, but still don't know",
            "I am going to learn now"
        ],
        "image": "",
        "answer": {
            "explanation": "How do you know about IOT?",
            "index": 0
        },
        "question": "How do you know about IOT?"
      }
    ],
    "name": "Demo",
    "trainingId": "EiJdnES8xyvI1HAhWiI2",
    "instructions": {
        "description": "markdown of instruction details which will be inserted through rich text",
        "title": "Demo Instruction Title"
    },
    "type": "mcq"
  })
  // Add mode state value
  const [newLesson, setNewLesson] = useState({
    name: "",
    trainingId: "",
    type: "",
    instructions: {
      title: "",
      description: ""
    },
    questions: []
  })

  const [instructions, setInstructions] = useState({
    title: "",
    description: ""
  })

  const [selectedQuestion, setSelectedQuestion] = useState({
    options: [],
    image: "",
    "answer": {
        explanation: "",
        index: -1
    },
    question: ""
  })
  const [questionDnDCards, setQuestionDnDCards] = useState(null)
  const questionDnDStateUpdatedOnce = useRef(false)

  useEffect(() => {
    if (setCurrentLesson && updateMode) {
      setCurrentLesson(prevState => ({
        ...prevState,
        instructions
      }))
    } else if (!updateMode) {
      setNewLesson(prevState => ({
        ...prevState,
        instructions
      }))
    }
  }, [instructions])

  useEffect(() => {
    if (!questionDnDStateUpdatedOnce.current) {
      if (updateMode) {
        setQuestionDnDCards(currentLesson.questions.map(q => q.question))
        questionDnDStateUpdatedOnce.current = true
      } else {
        setQuestionDnDCards(newLesson.questions.map(q => q.question))
        questionDnDStateUpdatedOnce.current = true
      }
    }
  }, [currentLesson])

  useEffect(() => {
    if (questionDnDCards) {
      if (updateMode) {
        setCurrentLesson(prevState => ({
          ...prevState,
          questions: questionDnDCards.map(qdc => currentLesson.questions.find(q => q.question === qdc))
        }))
      } else {
        setNewLesson(prevState => ({
          ...prevState,
          questions: questionDnDCards.map(qdc => currentLesson.questions.find(q => q.question === qdc))
        }))
      }
    }

    console.log("question dnd card updated", currentLesson)

  }, [questionDnDCards])

  const handleCardClick = (index, card) => {
    console.log("Clicked at card", index, ". ", card )
  }

  useEffect(() => {
    console.log("Current Lesson", currentLesson)
  }, [currentLesson])
  useEffect(() => {
    console.log("Selected question", selectedQuestion)
  }, [selectedQuestion])
  useEffect(() => {
    console.log("New Lesson", newLesson)
  }, [newLesson])

  return (
    <div>
      <CreateOrEditInstruction 
        instructions={instructions}
        setInstructions={setInstructions}
      />
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <Card sx={{ p: 2 }}>
            {questionDnDCards && <DNDList 
              cards={questionDnDCards}
              setCards={setQuestionDnDCards}
              onClick={handleCardClick}
            />}
          </Card>
        </Grid>
        <Grid item xs={7} >
          <Card sx={{ p: 2 }}>
            <h3>Add/Edit Quuestion</h3>
            <TextField 
              mlabel="Question"
              value={selectedQuestion.question}
              onChange={(e) => setSelectedQuestion(prevState => ({ ...prevState, question: e.target.value }))}
            />
            <ListInput 
              mlabel="Options"
              arr={selectedQuestion.options}
              setArr={(value) => {
                console.log("New array values", value)
                setSelectedQuestion(prevState => ({ ...prevState, options: value }))
              }}
            />
            <label><b>Answer</b></label>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Select 
                  options={selectedQuestion.options}
                  value={selectedQuestion.answer.index}
                  setValue={(value) => setSelectedQuestion(prevState => (
                    { 
                      ...prevState, 
                      answer: {
                        ...prevState.answer,
                        index: value,
                      }
                    }
                  ))}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  placeholder="Answer Explanation"
                  multiline
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export default CreateOrUpdateMCQ