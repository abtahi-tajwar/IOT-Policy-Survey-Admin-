import React from 'react'
import { Card, CardContent, Grid, Typography } from '@mui/material'
import Loader from '../components/Loader'
import Scenario from '../firebase/scenarios';
import Response from '../firebase/responses';
import Candidate from '../firebase/Candidate'

function Dashboard() {
    const response = new Response();
    const scenario = new Scenario();
    const candidate = new Candidate();
    const [totalScenarios, setTotalScenarios] = React.useState(null)
    const [totalResponses, setTotalResponses] = React.useState(null)
    const [totalCandidates, setTotalCandidates] = React.useState(null)

    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        response.count().then((res) => setTotalResponses(res))
        scenario.count().then((res) => setTotalScenarios(res))
        candidate.count().then((res) => setTotalCandidates(res))
    })
    React.useEffect(() => {
        if (totalScenarios && totalResponses && totalCandidates) {
            console.log(totalScenarios, totalResponses, totalCandidates)
            setIsLoading(false)
        }
    }, [totalScenarios, totalResponses, totalCandidates])  
  return (
    <div>
        <Loader isLoading={isLoading}>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Card>
                        <CardContent>
                            <Typography variant='h5'>Total Active Scenarios</Typography>
                            <Typography variant='p'>{totalScenarios}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card>
                        <CardContent>
                            <Typography variant='h5'>Total Responses</Typography>
                            <Typography variant='p'>{totalResponses}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card>
                        <CardContent>
                            <Typography variant='h5'>Total Candidates</Typography>
                            <Typography variant='p'>{totalCandidates}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Loader>
    </div>
  )
}

export default Dashboard