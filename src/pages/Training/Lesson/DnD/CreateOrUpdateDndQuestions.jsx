import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import Button from "../../../../components/Button";
import AddIcon from "@mui/icons-material/Add";
import { Dialog, DialogTitle, DialogContent, DialogActions, Grid } from "@mui/material";
import Select from "../../../../components/Select";
import TextField from "../../../../components/TextField";
import Slide from "@mui/material/Slide";

function CreateOrUpdateDndQuestions({ question, setQuestion }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  // Type: <"blank" | "sentence">
  const [inputType, setInputType] = useState("sentence")
  const [sentenceInput, setSentenceInput] = useState("")
  const [isValidInput, setIsValidInput] = useState(false)
  const [updateMode, setUpdateMode] = useState(false)
  const [updatePartIndex, setUpdatePartIndex] = useState(-1)
  const inputTypeOptions = [ 
    { label: "Sentence", value: "sentence" },
    { label: "Blank", value: "blank" }
  ]

  useEffect(() => {
    if (inputType !== 'blank' && sentenceInput === '') {
      setIsValidInput(false)
    } else {
      setIsValidInput(true)
    }
  }, [inputType, sentenceInput])

  const handleAddPart = (q, partIndex) => {
    if (isValidInput) {
      if (updateMode) {
        setQuestion(q.map((part, pi) => {
          if (pi === partIndex) return inputType === 'blank' ? '{{blank}}' : sentenceInput
          return part
        }))
        setUpdateMode(false)
      } else {
        setQuestion([ ...q, inputType === 'blank' ? '{{blank}}' : sentenceInput ])
      }
    }
    setSentenceInput("")
    setDialogOpen(false)
  }
  const handlePartDelete = (q, partIndex) => {
    setQuestion(q.filter((part, pi) => pi !== partIndex))
    setSentenceInput("")
    setDialogOpen(false)
  }
  const handleEditDialogOpen = (index) => {
    setUpdatePartIndex(index)
    setInputType(question[index] === '{{blank}}' ? 'blank' : 'sentence')
    setSentenceInput(question[index] === '{{blank}}' ? '' : question[index])
    setUpdateMode(true)
    setDialogOpen(true)
  }
  return (
    <>
      <Wrapper>
        <div className="question-container">
          {question.map((part, pi) => (
            <span className={part === "{{blank}}" ? "part blank" : "part"} onClick={() => handleEditDialogOpen(pi)}>
              {part === "{{blank}}" ? "____" : part}
            </span>
          ))}
          &nbsp;
          <Button 
            size="small" 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Extend
          </Button>
        </div>
      </Wrapper>
      <Dialog
        open={dialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setDialogOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Add New Question Part</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Select 
                label="Part Type"
                options={inputTypeOptions}
                value={inputType}
                setValue={setInputType}
              />
            </Grid>
            {inputType !== 'blank' && <Grid item xs={12}>
              <TextField
                value={sentenceInput}
                onChange={e => setSentenceInput(e.target.value)}
              />
            </Grid>}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" disabled={!isValidInput} onClick={() => handleAddPart(question, updatePartIndex)}>
            { updateMode ? 'Save' : 'Add' }
          </Button>
          {updateMode && <Button variant="contained" color="danger" onClick={() => handlePartDelete(question, updatePartIndex)}>Delete</Button>}
          <Button variant="outlined" onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Wrapper = styled.div`
  .question-container {
    .part {
      cursor: pointer;
      transition: background-color .3s ease-out;
      &:hover {
        padding-left: 10px;
        padding-right: 10px;
        background-color: #f1f1f1;
      }
    }
  }
`;

export default CreateOrUpdateDndQuestions;
