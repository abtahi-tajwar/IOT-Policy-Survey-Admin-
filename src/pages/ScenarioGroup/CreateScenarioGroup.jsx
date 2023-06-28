import React from 'react'
import { Typography, TextField , Grid, Button, Switch, FormGroup, FormControlLabel } from '@mui/material'

import ConfirmationPopup from '../../components/ConfirmationPopup';
import ScenarioGroups from '../../firebase/scenario_groups';

function CreateScenarioGroup() {
    const scenario_group = new ScenarioGroups();
    const [uploadLoading, setUploadLoading] = React.useState(false)
    const [confirmationPopup, setConfirmationPopup] = React.useState({
        show: false,
        error: false,
        text: ""
    })
    const [input, setInput] = React.useState({
        name: "",
        active: true
    })
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
    const handleSubmit = () => {
        setUploadLoading(true)
        scenario_group.create({
            name: input.name,
            active: input.active,
            totalAssignedUsers: 0,
            scenarios: []
        }).then((res) => {
            if (res.success) {
                setUploadLoading(false)
                setConfirmationPopup({
                    show: true,
                    error: false,
                    text: "Successfully added scenario group"
                })
                setInput({
                    name: "",
                    active: true
                })
            } else {
                console.log(res.error)
                setConfirmationPopup({
                    show: true,
                    error: true,
                    text: "Failed to add scenario group"
                })
            }

        })
    }
  return (
    <>
    <Grid container spacing={2}>
        <Grid item xs={12}>
            <TextField  
                name="name"
                label="Scenarion Group Name"
                placeholder="Scenario Group Name"
                value={input.name}
                onChange={handleTextInput}
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
            <Button variant="contained" disabled={uploadLoading} onClick={handleSubmit}>Create</Button>
        </Grid>
    </Grid>
    <ConfirmationPopup data={confirmationPopup} />
    </>
  )
}

export default CreateScenarioGroup