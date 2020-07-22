import React, { useEffect, useState, useMemo } from 'react';
import './App.css';
import Drawer from '@material-ui/core/Drawer';
import { Switch, ThemeProvider, createMuiTheme } from '@material-ui/core';
import {UserContext} from './UserContext';
import { retrieveUser, getToken } from './api/auth';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import Main from './components/Main';

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

  const providerValue = useMemo(() => ({user, setUser}), [user, setUser]);

  useEffect(() => {
    retrieveUser(getToken())
    .then(user => setUser(user))
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={providerValue}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <div className="app">
              {user !== undefined && <Main />}
          </div>
        </MuiPickersUtilsProvider>
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default App;
