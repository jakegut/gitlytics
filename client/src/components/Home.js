import React from 'react';
import { ReactComponent as Logo } from '../gitlytics-logo.svg'
import { Container, Grid, Typography } from '@material-ui/core';

export default function Home() {
    return(
        <Container>
            <Grid 
            container
            direction="column"
            justify="center"
            alignItems="center"
            style={{minHeight: "calc(100vh - 200px)"}}
            >
                <Grid item alignItems="center">
                    <Logo width="400" height="auto" fill="#c83737"/>
                </Grid>
                <Grid item alignItems="center">
                    <Typography variant="h2" style={{fontWeight: "600"}}>
                        gitlytics
                    </Typography>
                </Grid>
            </Grid>
        </Container>
    )
}