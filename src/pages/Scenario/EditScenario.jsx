import React from 'react'
import { Typography, TextField , Grid, Button, Switch, FormGroup, FormControlLabel } from '@mui/material'
import { useParams } from 'react-router-dom';
import ConfirmationPopup from '../../components/ConfirmationPopup';
import Scenario from '../../firebase/scenarios'
import Loader from '../../components/Loader';

function EditScenario() {
    const scenario = new Scenario();
    const { id } = useParams()
    const [uploadLoading, setUploadLoading] = React.useState(false)
    const [sceneId, setSceneId] = React.useState(null)
    const [currentScene, setCurrentScene] = React.useState(null)
    const [loading, setLoading] = React.useState(true)
    const [confirmationPopup, setConfirmationPopup] = React.useState({
        show: false,
        error: false,
        text: ""
    })
    const [input, setInput] = React.useState({
        name: "",
        scenario: null,
        instruction: null,
        order: 0,
        active: true
    })
    React.useEffect(() => {
        setLoading(true)
        scenario.getById(id).then(res => {
            setCurrentScene(res.response)
            setSceneId(res.response.id)
            setInput({
                name: res.response.data.name,
                scenario: res.response.data.scenario_markdown,
                instruction: res.response.data.instruction_markdown,
                order: res.response.data.order,
                active: res.response.data.active
            })
            setLoading(false)
        })
    }, [])
    const handleTextInput = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
    }
    const handleToggleInput = (e, name) => {
        setInput({
            ...input,
            [name]: e.target.checked
        })
    }
    const handleFileInput = (e) => {
        setInput({
            ...input,
            [e.target.name]: {
                type: 'file',
                file: e.target.files[0],
                name: e.target.files[0].name
            }
        })
    }

    const handleSubmit = () => {
        console.log(currentScene)
        setUploadLoading(true)
        const editedData = {
            name: input.name,
            instruction_markdown: (input.instruction.type === 'file') ? {
                previous: currentScene.data.instruction_markdown,
                ...input.instruction
            } : input.instruction,
            scenario_markdown: (input.scenario.type === 'file') ? {
                previous: currentScene.data.scenario_markdown,
                ...input.scenario
            } : input.scenario,
            order: parseInt(input.order),
            active: input.active
        }
        console.log("Edited data", editedData)
        scenario.update(sceneId, editedData).then((res) => {
            if (res.success) {
                setUploadLoading(false)
                setConfirmationPopup({
                    show: true,
                    error: false,
                    text: "Successfully Updated scenario"
                })
            } else {
                console.log(res.error)
                setConfirmationPopup({
                    show: true,
                    error: true,
                    text: "Failed to updated scenario"
                })
            }

        })
    }
  return (
    <Loader isLoading={loading}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField  
                    name="name"
                    label="Scenarion Name"
                    placeholder="Scenario Name"
                    value={input.name}
                    onChange={handleTextInput}
                    fullWidth 
                />
            </Grid>
            <Grid container item xs={12} spacing={1}>
                <Grid item xs={12}>
                    <Typography variant="p">Upload Scenario Markdown File</Typography>
                </Grid>
                <Grid item xs={12}>
                    <input
                        accept=".md"
                        style={{ display: 'none' }}
                        id="scenario-file"
                        type="file"
                        name="scenario"
                        onChange={handleFileInput}
                    />
                    <label htmlFor="scenario-file">
                        <Button variant="outlined" size="small" component="span">
                            Upload
                        </Button>
                    </label>
                    <p>{input.scenario?.name}</p>
                </Grid>
            </Grid>
            <Grid container item xs={12} spacing={1}>
                <Grid item xs={12}>
                    <Typography variant="p">Upload Scenario Markdown Instruction File</Typography>
                </Grid>
                <Grid item xs={12}>
                    <input
                        accept=".md"
                        style={{ display: 'none' }}
                        id="instruction-file"
                        type="file"
                        name="instruction"
                        onChange={handleFileInput}
                    />
                    <label htmlFor="instruction-file">
                        <Button variant="outlined" size="small" component="span">
                            Upload
                        </Button>
                    </label>
                    <p>{input.instruction?.name}</p>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <TextField  
                    name="order"
                    label="Order"
                    value={input.order}
                    onChange={handleTextInput}
                    type="number"
                    fullWidth 
                />
            </Grid>
            <Grid item xs={12}>
                <FormGroup>
                    <FormControlLabel 
                        control={<Switch 
                            checked={input.active}
                            onChange={e => handleToggleInput(e, 'active')}
                            defaultChecked 
                        />} 
                        label={input.active ? "Active" : "Draft"} 
                    />
                </FormGroup>
            </Grid>
            <Grid item>
                <Button variant="contained" disabled={uploadLoading} onClick={handleSubmit}>Submit</Button>
            </Grid>
        </Grid>
        <ConfirmationPopup data={confirmationPopup} />
    </Loader>
  )
}

export default EditScenario