import React, { useEffect, useRef, useState } from 'react'
import CreateOrEditInstruction from '../CreateOrEditInstruction'
import DNDList from '../../../../components/DNDList/DNDList'
import { Grid, Card, Box, Button } from '@mui/material'
import TextField from '../../../../components/TextField'
import ListInput from '../../../../components/ListInput'
import Select from '../../../../components/Select'
import ImageCropUploader from '../../../../components/ImageCropUploader'
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Lesson from '../../../../firebase/Lesson'
import CustomButton from '../../../../components/Button'
import AlertDialog from '../../../../components/AlertDialog'
import ConfirmationPopup from '../../../../components/ConfirmationPopup'
import { useNavigate } from 'react-router-dom'

function CreateOrUpdateMCQ({ lessonId, currentLesson, setCurrentLesson, updateMode }) {
  const navigate = useNavigate()
  const lesson = new Lesson()
  // Update mode placeholder value
  // const [currentLesson, setCurrentLesson] = useState({
  //   "questions": [
  //     {
  //       "options": [
  //           "lamborghini",
  //           "bughatti",
  //           "marcedes",
  //           "ferrari"
  //       ],
  //       "image": "",
  //       "answer": {
  //           "explanation": "Explanation of why this is the correct answer",
  //           "index": 0
  //       },
  //       "question": "What is the name of your favourite car"
  //     },
  //     {
  //       "options": [
  //           "Extremely Good",
  //           "Good",
  //           "Not Bad",
  //           "Bad"
  //       ],
  //       "image": "",
  //       "answer": {
  //           "explanation": "Explanation of why this is the correct answer",
  //           "index": 0
  //       },
  //       "question": "How would you feel if you can go to france?"
  //     },
  //     {
  //       "options": [
  //           "I don't know",
  //           "I am illiterate, how would I know?",
  //           "I read a book, but still don't know",
  //           "I am going to learn now"
  //       ],
  //       "image": "",
  //       "answer": {
  //           "explanation": "How do you know about IOT?",
  //           "index": 0
  //       },
  //       "question": "How do you know about IOT?"
  //     }
  //   ],
  //   "image": "",
  //   "name": "Demo",
  //   "trainingId": "EiJdnES8xyvI1HAhWiI2",
  //   "instructions": {
  //       "description": "markdown of instruction details which will be inserted through rich text",
  //       "title": "Demo Instruction Title"
  //   },
  //   "type": "mcq"
  // })
  const currentLessonRef = useRef(currentLesson)
  // Add mode state value
  const [newLesson, setNewLesson] = useState({
    name: "",
    trainingId: "",
    type: "mcq",
    image: "",
    instructions: {
      title: "",
      description: ""
    },
    questions: []
  })
  const newLessonRef = useRef(newLesson)
  /** Selected Question State
   * {
      options: [],
      image: "",
      "answer": {
          explanation: "",
          index: -1
      },
      question: ""
    }
   */
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0)
  const [newStagedQuestion, setNewStagedQuestion] = useState({
    options: [],
    image: "",
    "answer": {
        explanation: "",
        index: -1
    },
    question: ""
  })
  const [isNewQuestionValid, setIsNewQuestionValid] = useState(false)
  const [addQuestionDialogOpen, setAddQuestionDialogOpen] = useState(false)
  const [questionDnDCards, setQuestionDnDCards] = useState(null)
  const questionDnDStateUpdatedOnce = useRef(false)
  const [saveLessonLoading, setSaveLessonLoading] = useState(false)
  const [confirmationPopup, setConfirmationPopup] = useState({
    show: false,
    error: false,
    text: ""
})

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
  }, [currentLesson, newLesson])

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
          questions: questionDnDCards.map(qdc => newLesson.questions.find(q => q.question === qdc))
        }))
      }
    }

    console.log("question dnd card updated", currentLesson)

  }, [questionDnDCards])

  useEffect(() => {
    if (selectedQuestion) {
      if (updateMode) {
        setCurrentLesson(prevState => ({
          ...prevState,
          questions: prevState.questions.map((question, i) => {
            if (selectedQuestionIndex === i) return selectedQuestion
            return question
          })
        }))
      } else {
        setNewLesson(prevState => ({
          ...prevState,
          questions: prevState.questions.map((question, i) => {
            if (selectedQuestionIndex === i) return selectedQuestion
            return question
          })
        }))
      }
    }
  }, [selectedQuestion])

  useEffect(() => {
    if (
      newStagedQuestion.question !== ''
      && newStagedQuestion.options.length !== 0
      && newStagedQuestion.answer.index !== -1
    ) {
      setIsNewQuestionValid(true)
    } else {
      setIsNewQuestionValid(false)
    }
  }, [newStagedQuestion])

  const handleUpdateLessonName = (value) => {
    if (updateMode) {
      setCurrentLesson(prevState => ({
        ...prevState,
        name: value
      }))
    } else {
      setNewLesson(prevState => ({
        ...prevState,
        name: value
      }))
    }
  }
  const handleCardClick = (index, card) => {
    setSelectedQuestionIndex(index)
    if (updateMode) {
      setSelectedQuestion(currentLessonRef.current.questions[index])
    } else {
      setSelectedQuestion(newLessonRef.current.questions[index])
    }
  }
  const handleUpdateLessonInstructions = (instructions) => {
    if (updateMode) {
      setCurrentLesson(prevState => ({
        ...prevState,
        instructions
      }))
    } else {
      setNewLesson(prevState => ({
        ...prevState,
        instructions
      }))
    }
  }
  const handleUploadLessonImage = (image) => {
    if (updateMode) {
      setCurrentLesson(prevState => ({
        ...prevState,
        image
      }))
    } else {
      setNewLesson(prevState => ({
        ...prevState,
        image
      }))
    }
  }

  const handleSaveNewQuestion = (newQuestion) => {
    if (updateMode) {
      setCurrentLesson(prevState => ({ ...prevState, questions: [ ...prevState.questions, newQuestion ] }) ) 
      questionDnDStateUpdatedOnce.current = false
    } else {
      setNewLesson(prevState => ({ ...prevState, questions: [ ...prevState.questions, newQuestion ] }) )
      questionDnDStateUpdatedOnce.current = false
    }
    setNewStagedQuestion({
      options: [],
      image: "",
      "answer": {
          explanation: "",
          index: -1
      },
      question: ""
    })
    setAddQuestionDialogOpen(false)
  }

  const handleSaveLesson = () => {
    setSaveLessonLoading(true)
    if (updateMode) {
      lesson.update(lessonId, currentLessonRef.current).then(res => {
        setSaveLessonLoading(false)
        setConfirmationPopup({
          show: true,
          error: false,
          text: "Lesson Updated Succesfully"
        })
      }).catch(e => {
        console.log("Failed to update lesson", e)
        setConfirmationPopup({
          show: true,
          error: true,
          text: "Failed to update lesson"
        })
      })
    } else {
      lesson.create(newLessonRef.current).then(res => {
        setSaveLessonLoading(false)
        setConfirmationPopup({
          show: true,
          error: false,
          text: "New Lesson Created Successfully"
        })
        navigate('/lesson/all')
      }).catch(e => {
        console.log("Failed to Add New Lesson", e)
        setConfirmationPopup({
          show: true,
          error: true,
          text: "Failed to Add New Lesson"
        })
      })
    }
    
  }

  useEffect(() => {
    console.log("Current Lesson", currentLesson)
    currentLessonRef.current = currentLesson
  }, [currentLesson])
  useEffect(() => {
    console.log("Selected question", selectedQuestion)
  }, [selectedQuestion])
  useEffect(() => {
    console.log("New Lesson", newLesson)
    newLessonRef.current = newLesson
  }, [newLesson])

  return (
    <div>
      <TextField 
        mlabel="Lesson Name"
        value={updateMode ? currentLesson.name : newLesson.name}
        onChange={e => handleUpdateLessonName(e.target.value)}
        sx={{ mb: 3 }}
      />
      <CreateOrEditInstruction 
        instructions={updateMode ? currentLesson.instructions : newLesson.instructions}
        setInstructions={handleUpdateLessonInstructions}
      />
      <Card sx={{ mt: 3, p: 2 }}>
        <label><b>Add Lesson Image</b></label>
        <ImageCropUploader 
          image={!updateMode ? newLesson.image : currentLesson.image}
          setImage={handleUploadLessonImage}
          type="banner"
          aspectRatio={1.5}
        />
      </Card>
      <Box sx={{ width: '50%', margin: '0 auto', mt: 3 }}>
        <Button variant="contained" sx={{ width: '100%' }} onClick={() => setAddQuestionDialogOpen(true)}>Add New Question</Button>
      </Box>
      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid item xs={selectedQuestion ? 5 : 12}>
          <Card sx={{ p: 2 }}>
            {questionDnDCards && <DNDList 
              cards={questionDnDCards}
              setCards={setQuestionDnDCards}
              onClick={handleCardClick}
            />}
          </Card>
        </Grid>
        { selectedQuestion && <Grid item xs={7} >
          <Card sx={{ p: 2 }}>
            <h3>Edit Question</h3>
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
            {/* Answer Input */}
            <Box sx={{ mt: 3 }}>
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
            </Box>

            {/* Image Input */}
            <Box sx={{ mt: 3 }}>
              <label><b>Add Image</b></label>
              <ImageCropUploader 
                image={selectedQuestion.image}
                setImage={(image) => setSelectedQuestion(prevState => ({ ...prevState, image }))}
                type="banner"
                aspectRatio={1.5}
              />
            </Box>
          </Card>
          
        </Grid> }
      </Grid>

      <Dialog
        open={addQuestionDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setAddQuestionDialogOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Add New Question</DialogTitle>
        <DialogContent>
            <TextField 
              mlabel="Question"
              value={newStagedQuestion.question}
              onChange={(e) => setNewStagedQuestion(prevState => ({ ...prevState, question: e.target.value }))}
            />
            <ListInput 
              mlabel="Options"
              arr={newStagedQuestion.options}
              setArr={(value) => {
                console.log("New array values", value)
                setNewStagedQuestion(prevState => ({ ...prevState, options: value }))
              }}
            />
            {/* Answer Input */}
            <Box sx={{ mt: 3 }}>
              <label><b>Answer</b></label>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Select 
                    options={newStagedQuestion.options}
                    value={newStagedQuestion.answer.index}
                    setValue={(value) => setNewStagedQuestion(prevState => (
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
            </Box>

            {/* Image Input */}
            <Box sx={{ mt: 3 }}>
              <label><b>Add Image</b></label>
              <ImageCropUploader 
                image={newStagedQuestion.image}
                setImage={(image) => setNewStagedQuestion(prevState => ({ ...prevState, image }))}
                type="banner"
                aspectRatio={1.5}
              />
            </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleSaveNewQuestion(newStagedQuestion)} disabled={!isNewQuestionValid}>Save</Button>
          <Button onClick={() => setAddQuestionDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ width: '50%', margin: '0 auto', mt: 3}}>
        <CustomButton variant='contained' sx={{ width: '100%' }} onClick={handleSaveLesson} loading={saveLessonLoading}>
          Save
        </CustomButton>
      </Box>

      <ConfirmationPopup data={confirmationPopup} />
    </div>
  )
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default CreateOrUpdateMCQ