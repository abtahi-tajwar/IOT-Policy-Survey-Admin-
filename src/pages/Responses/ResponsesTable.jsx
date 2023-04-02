import { IconButton, Button } from '@mui/material'
import React from 'react'
import BasicTable from '../../components/BasicTable'
import BasicDialog from '../../components/BasicDialog'

function ResponsesTable({ data }) {
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [currentResponse, setCurrentResponse] = React.useState(null)
    const handleShowResponse = (data) => {
        setCurrentResponse(data)
        setDialogOpen(true)
    }
    const columns = [
        {
            id: "userId",
            label: "Candidate Id",
            nameCol: true
        },
        {
            id: "timeRequired",
            label: "Time Required To Finish"
        },
        {
            id: "view",
            label: "View",
            render: (rowData) => (
                <Button 
                    variant="contained"
                    size="small"
                    onClick={() => handleShowResponse(rowData)}
                >
                    Details
                </Button>
            )
        }
    ]
  return (
    <>
        <BasicTable 
            columns={columns}
            data={data}
        />
        <BasicDialog 
            open={dialogOpen}
            setOpen={setDialogOpen}
        >
            {currentResponse && (
                <>
                    <h2>{currentResponse.sceneName}</h2>
                    <p><i>Time Take: {currentResponse.timeRequired}</i></p>
                    <p><b>Candidate: </b>{currentResponse.userId}</p>
                    <p><b>Answer: </b> {currentResponse.answer}</p>
                </>
            )}
        </BasicDialog>
    </>
  )
}

export default ResponsesTable