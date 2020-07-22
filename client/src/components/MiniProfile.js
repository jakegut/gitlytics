import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import pic from "../default-profile.png"

import {UserContext} from '../UserContext';

const useStyles = makeStyles((theme) => ({
    profile: {
        paddingTop: "8px",
        paddingBottom: "8px",
        minHeight: "100px",
        backgroundColor: theme.palette.background.default,
        paddingLeft: "20px"
    },
    text: {
        
    },
    pfp: {
        width: "64px",
        height: "64px",
        borderRadius: "50%"
    }
}));

export default function MiniProfile() {
    const classes = useStyles();

    const {user, setUser} = useContext(UserContext);

    return(
        <div className={classes.profile}>
            <img src={user == null ? pic : user.avatar_url} className={classes.pfp}/>
            <Typography className={classes.text}>
                Hello, {user == null ? "guest" : user.username }!
            </Typography>
        </div>
    )
}