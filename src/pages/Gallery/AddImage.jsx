import React from 'react'
import { TextField, Grid, Typography, Button } from '@mui/material'
import Gallery from '../../firebase/Gallery'

function AddImage() {
    const gallery = new Gallery()
    const [input, setInput] = React.useState({
        imageName: "",
        image: null
    })
    const [loading, setLoading] = React.useState(false)
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
        setLoading(true)
        const _obj = {
            imageName: input.imageName,
            image: input.image
        }
        gallery.create(_obj).then(res => {
            console.log("Image uploaded Successfully", res)
            setInput({
                imageName: "",
                image: null
            })
            setLoading(false)
        }).catch(e => {
            console.log(e)
            setLoading(false)
        })
    }
  return (
    <div>
        <h2>Create Gallery Image</h2>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField 
                    name="imageName"
                    label="Image Name"
                    placeholder="Give your image a unique name"
                    value={input.imageName}
                    onChange={(e) => setInput({ ...input, imageName: e.target.value })}
                    fullWidth
                />
            </Grid>
            <Grid container item xs={12} spacing={1}>
                <Grid item xs={12}>
                    <Typography variant="p">Upload Image File</Typography>
                </Grid>
                <Grid item xs={12}>
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="image-file"
                        type="file"
                        name="image"
                        onChange={handleFileInput}
                    />
                    <label htmlFor="image-file">
                        <Button variant="outlined" size="small" component="span">
                            Upload
                        </Button>
                    </label>
                    <p>{input.image?.name}</p>
                </Grid>
            </Grid>
            <Grid item xs={12} container justifyContent="center">
                <Button 
                    variant='contained' 
                    onClick={handleSubmit}
                    disabled={loading}
                >Create New Instance</Button>
            </Grid>
        </Grid>
    </div>
  )
}

export default AddImage