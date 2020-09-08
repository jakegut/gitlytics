import React from 'react'
import { Container, Grid, Paper, Typography, makeStyles, Button, CircularProgress } from '@material-ui/core'
import { ReactComponent as Logo } from '../gitlytics-logo.svg'
import { Switch, Route, Redirect } from 'react-router-dom';
import GitHubIcon from '@material-ui/icons/GitHub'
import Callback from './Callback';
import { getAxiosConfig } from '../api/util';
import Axios from 'axios';
import { isLoggedIn } from '../api/auth';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  // necessary for content to be below app bar
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    height: "100vh"
  },
  container: {
    height: "100%"
  },
  p: {
    textAlign: "center",
    padding: theme.spacing(3)
  }
}));


export default function Landing(){

  const classes = useStyles();

  function getAuthLink(){
    Axios.get("/auth/login", getAxiosConfig())
    .then(response => response.data)
    .then(data => {
        window.location = data.url;
    })
  }

  return (
    <React.Fragment>
      {!isLoggedIn() ? (
        <main className={classes.content}>
        <Container maxWidth="lg" className={classes.container}>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            className={classes.container}
          >
            <Grid item xs={10} sm={6} md={4} lg={3}>
              <Paper className={classes.p}>
                <Logo width="150" height="auto" fill="#F44336"/>
                <Typography variant="h4" style={{fontWeight: "600"}}>
                    gitlytics
                </Typography>
                <Switch>
                  <Route exact path="/">
                    <Button 
                      variant="contained"
                      color="primary"
                      startIcon={<GitHubIcon />}
                      style={{marginTop: "16px"}}
                      onClick={getAuthLink}
                    >
                      Log in with GitHub
                    </Button>
                  </Route>
                  <Route path ="/callback" component={Callback}/>
                </Switch>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
      ) : (
        <Redirect to="/main"/>
      ) }
      
    </React.Fragment>
  )
}