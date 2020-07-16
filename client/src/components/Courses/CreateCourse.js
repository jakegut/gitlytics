import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import { Typography, Button, TextField } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import SearchUsers from '../SearchUsers'
import { createCourse } from '../../api/courseService';

export default function CreateCourse(){

    const [selectedUsers, setSelectedUsers] = useState([])
    const [name, setName] = useState("")
    const [error, setError] = useState({})

    const history = useHistory()

    function onUserSelect(user){
        if(!selectedUsers.includes(user))
            setSelectedUsers(selected => selected.concat(user))
    }

    function onUserRemove(user){
        setSelectedUsers(selectedUsers.filter(i => i !== user))
    }

    function handleFormSubmit(event){
        event.preventDefault()
        let data = {
            "name": name,
            "invited_users": selectedUsers
        }
        createCourse(data)
        .then(response => {
            history.push('/courses')
        })
        .catch(error => {
            console.log(error.response.data)
            setError(error.response.data.error)
        })
    }

    return(
    <Container maxWidth="sm">
        <Grid
        container
        direction="row"
        justify="center"
        alignItems="flex-start"
        >
        <Grid item xs={12}>
            <Typography variant="h4">
            Create Course
            </Typography>
        </Grid>
        <Grid item xs={10}>
            <form>
            <TextField 
                label="Name" 
                required
                fullWidth
                error={error.name !== undefined}
                style={{margin: "8px"}}
                helperText={error.name}
                value={name}
                onInput={(event) => setName(event.target.value)}
            />
            <br />
            <div style={{margin: "8px"}}>
                <Typography>
                    Invite Users
                </Typography>
                <SearchUsers selectedUsers={selectedUsers}  onUserSelect={onUserSelect} onUserRemove={onUserRemove}/>
            </div>
            <Button onClick={handleFormSubmit} variant="contained" style={{margin: "8px"}}>
                Submit
            </Button>
            </form>
        </Grid>
        
        </Grid>
    </Container>
    )
}