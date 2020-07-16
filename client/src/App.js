import React, { useEffect, useState, useMemo } from 'react';
import './App.css';
import Drawer from '@material-ui/core/Drawer';
import { Switch } from '@material-ui/core';
import {UserContext} from './UserContext';
import { retrieveUser, getToken } from './api/auth';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import Main from './components/Main';

function App() {

  const [user, setUser] = useState(null);

  const providerValue = useMemo(() => ({user, setUser}), [user, setUser]);

  useEffect(() => {
    retrieveUser(getToken())
    .then(user => setUser(user))
  }, [])

  return (
    <UserContext.Provider value={providerValue}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <div className="app">
            <Main />
        </div>
      </MuiPickersUtilsProvider>
    </UserContext.Provider>
  );
}

export default App;
