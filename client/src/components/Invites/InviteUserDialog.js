import React, { useState } from 'react'
import SearchUsers from '../SearchUsers'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid'
import InvitedCourseItem from './InvitedCourseItem'
import { Typography, Button } from '@material-ui/core';
import { createInvite } from '../../api/courseService';

export default function InviteUserDialog({open, setOpen, courseId, addInvites}){
    const [selectedUsers, setSelectedUsers] = useState([])

    function onUserSelect(user){
        if(!selectedUsers.includes(user))
            setSelectedUsers(selected => selected.concat(user))
    }

    function onUserRemove(user){
        setSelectedUsers(selectedUsers.filter(i => i !== user))
    }

    function handleClose(event){
        setOpen(false)
        setSelectedUsers([])
    }

    function inviteUsers(){
        let payload = {
            course_id: courseId,
            usernames: selectedUsers
        }
        createInvite(payload)
        .then(data => {
            addInvites(data)
            setOpen(false)
        })
    }


    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Invite Students
            </DialogTitle>
            <DialogContent>
                <Grid container
                    direction="column"
                    justify="flex-start"
                    alignItems="center">
                    <SearchUsers selectedUsers={selectedUsers} onUserRemove={onUserRemove} onUserSelect={onUserSelect}/>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    Cancel
                </Button>
                <Button color='primary' onClick={inviteUsers}>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    )
}