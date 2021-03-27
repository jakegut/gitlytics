import React, { useEffect, useState, useMemo } from 'react';
import './App.css';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';
import {UserContext} from './UserContext';
import { retrieveUser, getToken } from './api/auth';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import Main from './components/Main';
import Landing from './components/Landing';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

const theme = createMuiTheme({
  palette:{
    type: "dark",
    primary: {
      main: '#F44336'
    }
  }
})

function App() {

  const [user, setUser] = useState(undefined);

  const history = useHistory();
  let { path } = useRouteMatch();

  const providerValue = useMemo(() => ({user, setUser}), [user, setUser]);

  useEffect(() => {
    retrieveUser(getToken())
    .then(user => setUser(user))
    .catch(err => {
      setUser(null);
      localStorage.removeItem("token");
      if(path !== "/")
        history.push("/")
    })
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={providerValue}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <div className="app">
              {/* {user !== undefined && <Main />} */}
              {user !== undefined && (
                <Switch>
                  <Route path="/main" component={Main} />
                  <Route exact path="/" component={Landing} />
                  <Route path="/callback" component={Landing} />
                </Switch>
              )}
          </div>
        </MuiPickersUtilsProvider>
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default App;
