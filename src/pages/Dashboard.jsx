import React from 'react'
import { Card, CardContent, Grid, Typography } from '@mui/material'

function Dashboard() {
  return (
    <div>
        <Grid container spacing={2}>
            <Grid item xs={4}>
                <Card>
                    <CardContent>
                        <Typography variant='h5'>Total Active Scenarios</Typography>
                        <Typography variant='p'>23</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={4}>
                <Card>
                    <CardContent>
                        <Typography variant='h5'>Total Responses</Typography>
                        <Typography variant='p'>3</Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </div>
  )
}

export default Dashboard