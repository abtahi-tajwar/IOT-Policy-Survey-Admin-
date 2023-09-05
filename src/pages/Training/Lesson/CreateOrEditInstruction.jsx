import React from 'react'
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Grid } from '@mui/material';
import TextField from '../../../components/TextField';
import MDEditor from '@uiw/react-md-editor';
import { Card } from '@mui/material';

// CreateOrEditInstruction.propTypes = {
//     instruction: {
//         title: PropTypes.string,
//         description: PropTypes.string
//     },
//     setInstruction: PropTypes.func
// }

function CreateOrEditInstruction({ instructions, setInstructions }) {
    const [value, setValue] = React.useState("**Hello world!!!**");
  return (
    <Wrapper>
        <h2>Add/Edit Instuction</h2>
        <TextField 
            mlabel="Title" 
            sx={{ mb: 2 }} 
            value={instructions.title}
            onChange={e => setInstructions({ ...instructions, title: e.target.value })}
        />
        
        <label><b>Description</b></label>
        <MDEditor
            value={instructions.description}
            onChange={value => setInstructions({ ...instructions, description: value })}
        />
    </Wrapper>
  )
}

const Wrapper = styled(Card)`
    padding: 20px;
    box-sizing: border-box;
    border-radius: 10px;
    background-color: #f8f8f862;
`


export default CreateOrEditInstruction