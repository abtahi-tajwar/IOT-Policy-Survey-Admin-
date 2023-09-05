import React, { useEffect, useRef, useState } from 'react'
import CreateOrEditInstruction from '../CreateOrEditInstruction'
import DNDList from '../../../../components/DNDList/DNDList'
import { Grid, Card, Box, Button, Alert } from '@mui/material'
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
import CreateOrUpdateDndQuestions from './CreateOrUpdateDndQuestions'

function CreateOrUpdateDnD({ lessonId, currentLesson, setCurrentLesson, updateMode }) {
  const navigate = useNavigate()
  const lesson = new Lesson()
  // Update mode placeholder value
  // const [currentLesson, setCurrentLesson] = useState({
  //     "blanks": [
  //         {
  //             "answers": [
  //                 "if",
  //                 "then"
  //             ],
  //             "question": [
  //                 "{{blank}}",
  //                 " Fire Sprinkler is on ",
  //                 "{{blank}}",
  //                 " Water Valve is on"
  //             ],
  //             "questionString": "____ Fire Sprinkler is on ____ Water Valve is on"
  //         },
  //         {
  //             "question": [
  //                 "{{blank}}",
  //                 " Heater is on ",
  //                 "{{blank}}",
  //                 " Air Conditioner is of."
  //             ],
  //             "answers": [
  //                 "if",
  //                 "then"
  //             ],
  //             "questionString": "____ Heater is on ____ Air Conditioner is of."
  //         }
  //     ],
  //     "trainingId": "EiJdnES8xyvI1HAhWiI2",
  //     "type": "dnd",
  //     "instructions": {
  //         "description": "markdown of instruction details which will be inserted through rich text",
  //         "title": "Demo Instruction for DND Module"
  //     },
  //     "image": "",
  //     "name": "trainingName",
  //     "options": [
  //         "if",
  //         "then",
  //         "and",
  //         "or",
  //         "but"
  //     ]
  // })
  const currentLessonRef = useRef(currentLesson)
  /**
   * name: string,
   * trainingId: string,
   * type: "dnd",
   * instructions: {
   *  description: string,
   *  title: string
   * },
   * options: Array<string>,
   * blanks: Array<{
   *  questionString: string
   *  question: Array<string>
   *  answers: Array<string>
   * }>
   */
  const [newLesson, setNewLesson] = useState({
    name: "",
    trainingId: "",
    type: "dnd",
    instructions: {
      description: "",
      title: ""
    },
    image: "",
    options: [],
    blanks: []

  })
  const newLessonRef = useRef(newLesson)
  /** Selected Question State
   * {
      questionString: string
      question: Array<string>
      answers: Array<string>
    }
   */
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0)
  const [newStagedQuestion, setNewStagedQuestion] = useState({
    questionString: "",
    question: [],
    answers: []
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
  const [isValidLesson, setIsValidLesson] = useState(false)
  const [validationMessages, setValidationMessages] = useState([])

  useEffect(() => {
    if (!questionDnDStateUpdatedOnce.current) {
      if (updateMode) {
        setQuestionDnDCards(currentLesson.blanks.map(q => q.questionString))
        questionDnDStateUpdatedOnce.current = true
      } else {
        setQuestionDnDCards(newLesson.blanks.map(q => q.questionString))
        questionDnDStateUpdatedOnce.current = true
      }
    }
  }, [currentLesson, newLesson])

  useEffect(() => {
    if (questionDnDCards) {
      if (updateMode) {
        setCurrentLesson(prevState => ({
          ...prevState,
          blanks: questionDnDCards.map(qdc => currentLesson.blanks.find(q => q.questionString === qdc))
        }))
      } else {
        setNewLesson(prevState => ({
          ...prevState,
          blanks: questionDnDCards.map(qdc => newLesson.blanks.find(q => q.questionString === qdc))
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
          blanks: prevState.blanks.map((question, i) => {
            if (selectedQuestionIndex === i) return selectedQuestion
            return question
          })
        }))
      } else {
        setNewLesson(prevState => ({
          ...prevState,
          blanks: prevState.blanks.map((question, i) => {
            if (selectedQuestionIndex === i) return selectedQuestion
            return question
          })
        }))
      }
    }
  }, [selectedQuestion])

  useEffect(() => {
    const numberOfBlanks = newStagedQuestion.question.reduce((acc, curr) => curr === "{{blank}}" ? acc + 1 : acc, 0)
    if (numberOfBlanks === newStagedQuestion.answers.length) {
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
      setSelectedQuestion(currentLessonRef.current.blanks[index])
    } else {
      setSelectedQuestion(newLessonRef.current.blanks[index])
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
  const handleAddOptions = (options) => {
    if (updateMode) {
      setCurrentLesson(prevState => ({
        ...prevState,
        options
      }))
    } else {
      setNewLesson(prevState => ({
        ...prevState,
        options
      }))
    }
  }
  const handleUpdateSelectedQuestion = (question) => {
    setSelectedQuestion(prevState => ({ 
      ...prevState, 
      question,
      questionString: question.map(q => (q === '{{blank}}') ? '____' : q).join(" ")
    }))
    questionDnDStateUpdatedOnce.current = false
  }
  const handleUpdateNewStagedQuestion = (question) => {
    setNewStagedQuestion(prevState => ({ 
      ...prevState, 
      question,
      questionString: question.map(q => (q === '{{blank}}') ? '____' : q).join(" ")
    }))
    questionDnDStateUpdatedOnce.current = false
  }
  const handleSaveNewQuestion = (newQuestion) => {
    if (updateMode) {
      setCurrentLesson(prevState => ({ ...prevState, blanks: [ ...prevState.blanks, newQuestion ] }) ) 
      questionDnDStateUpdatedOnce.current = false
    } else {
      setNewLesson(prevState => ({ ...prevState, blanks: [ ...prevState.blanks, newQuestion ] }) )
      questionDnDStateUpdatedOnce.current = false
    }
    setNewStagedQuestion({
      questionString: "",
      question: [],
      answers: []
    })
    setAddQuestionDialogOpen(false)
  }
  const handleDeleteSelectedQuestion = (_selectedQuestionIndex) => {
    if (updateMode) {
      setCurrentLesson(prevState => ({
        ...prevState,
        blanks: prevState.blanks.filter((blank,bi) => bi !== _selectedQuestionIndex)
      }))
      questionDnDStateUpdatedOnce.current = false
    } else {
      setNewLesson(prevState => ({
        ...prevState,
        blanks: prevState.blanks.filter((blank,bi) => bi !== _selectedQuestionIndex)
      }))
      questionDnDStateUpdatedOnce.current = false
    }

    setSelectedQuestion(null)
  }
  const checkAndUpdateLessonValidity = (_lesson) => {
    let blankAndAnswerNumberMatch = true
    let minimumOneQuestion = true
    let optionMoreThanEqualToBlanks = true
    let _overAllTotalBlanks = 0
    _lesson.blanks.forEach(blank => {
      const _totalBlanks = blank.question.reduce((acc, curr) => curr === "{{blank}}" ? acc + 1 : acc, 0)
      _overAllTotalBlanks += _totalBlanks
      if (_totalBlanks !== blank.answers.length) {
        blankAndAnswerNumberMatch = false
      }
    })
    if (_overAllTotalBlanks > _lesson.options.length) optionMoreThanEqualToBlanks = false
    if (_lesson.blanks.length === 0) minimumOneQuestion = false
    const _validationMessages = []
    if (!blankAndAnswerNumberMatch) _validationMessages.push("Each question must contain same number of blanks and answers")
    if (!minimumOneQuestion) _validationMessages.push("A lesson must have atleast 1 blank/question")
    if (!optionMoreThanEqualToBlanks) _validationMessages.push("Options cannot be less then blanks")
    setValidationMessages(_validationMessages)
    setIsValidLesson(blankAndAnswerNumberMatch && minimumOneQuestion && optionMoreThanEqualToBlanks)
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
    if (updateMode) checkAndUpdateLessonValidity(currentLesson)
  }, [currentLesson])

  useEffect(() => {
    console.log("Is valid lesson?", isValidLesson)
  }, [isValidLesson])
  useEffect(() => {
    console.log("Selected question", selectedQuestion)
  }, [selectedQuestion])
  useEffect(() => {
    console.log("New Lesson", newLesson)
    newLessonRef.current = newLesson
    if (!updateMode) checkAndUpdateLessonValidity(newLesson)
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
      <ListInput 
        mlabel="Options"
        arr={updateMode ? currentLesson.options : newLesson.options}
        setArr={handleAddOptions}
      />
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
            <CreateOrUpdateDndQuestions 
              question={selectedQuestion.question}
              setQuestion={handleUpdateSelectedQuestion}
            />
            <ListInput 
              mlabel="Answers"
              arr={selectedQuestion.answers}
              setArr={(value) => {
                setSelectedQuestion(prevState => ({ ...prevState, answers: value }))
              }}
            />

            <Button variant='contained' color="error" onClick={() => handleDeleteSelectedQuestion(selectedQuestionIndex)}>Delete This Blank</Button>
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
        <DialogContent sx={{ minWidth: '500px' }}>
            <label>Start Adding Question From Here</label>
            <CreateOrUpdateDndQuestions 
              question={newStagedQuestion.question}
              setQuestion={handleUpdateNewStagedQuestion}
            />
            <ListInput 
              mlabel="Options"
              arr={newStagedQuestion.answers}
              setArr={(value) => {
                console.log("New array values", value)
                setNewStagedQuestion(prevState => ({ ...prevState, answers: value }))
              }}
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleSaveNewQuestion(newStagedQuestion)} disabled={!isNewQuestionValid}>Save</Button>
          <Button onClick={() => setAddQuestionDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ width: '50%', margin: '0 auto', mt: 3}}>
        <CustomButton 
          variant='contained' 
          sx={{ width: '100%' }} 
          onClick={handleSaveLesson} 
          loading={saveLessonLoading}
          disabled={!isValidLesson}
        >
          Save
        </CustomButton>
      </Box>
      
      {
        validationMessages.map((message, mi) => <Box sx={{ mt: 2 }}><Alert key={mi} severity="error">{message}</Alert></Box>)
      }

      <ConfirmationPopup data={confirmationPopup} />
    </div>
  )
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default CreateOrUpdateDnD