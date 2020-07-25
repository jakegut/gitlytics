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
                <Grid item>
                    <Logo width="300" height="auto" fill="#F44336"/>
                </Grid>
                <Grid item>
                    <Typography variant="h2" style={{fontWeight: "600"}}>
                        gitlytics
                    </Typography>
                </Grid>
            </Grid>
        </Container>
    )
}