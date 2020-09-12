import React, {useContext} from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import GitHubIcon from '@material-ui/icons/GitHub'
import ExitToApp from '@material-ui/icons/ExitToApp'
import ClassIcon from '@material-ui/icons/Class'
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import {Link, useHistory} from 'react-router-dom'

import {UserContext} from '../UserContext';
import axios from 'axios';
import { getAxiosConfig } from '../api/util';

export default function AuthList(){
    const {user, setUser} = useContext(UserContext);
    const history = useHistory();
    
    function getAuthLink(){
        axios.get("/auth/login", getAxiosConfig())
        .then(response => response.data)
        .then(data => {
            window.location = data.url;
        })
    }

    function logout(){
        axios.delete('/auth/logout', getAxiosConfig())
        .then(response => response.data)
        .then(data => {
            console.log(data)
            localStorage.removeItem("token")
            history.push("/")
        })
    }

    return (
        <List>
            {user ? (
            <React.Fragment>
                <Link to="/main/courses"><ListItem button>
                    <ListItemIcon><ClassIcon /></ListItemIcon>
                    <ListItemText primary="Courses" />
                </ListItem></Link>
                <ListItem button onClick={logout}>
                    <ListItemIcon><ExitToApp /></ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
             </React.Fragment>
             ):(
             <ListItem button onClick={getAuthLink}>
                <ListItemIcon><GitHubIcon /></ListItemIcon>
                <ListItemText primary="Login" />
            </ListItem>
            )
            }
            
        </List>
    )
}