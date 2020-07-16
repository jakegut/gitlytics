import React, {useEffect, useContext} from 'react';
import {UserContext} from '../UserContext';
import { setToken, retrieveAccessTokenAndUser } from '../api/auth'
import { useHistory } from 'react-router-dom'

export default function Callback(){
    const {user, setUser} = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const code = params.get('code')
        retrieveAccessTokenAndUser(code)
        .then((data) => {
            setUser(data.user)
            setToken(data.access_token)
            // history.push("/")
        })
    }, [])

    return(
        <p>Test...</p>
    )
}