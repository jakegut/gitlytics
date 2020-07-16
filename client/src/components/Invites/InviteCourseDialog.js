import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid'
import InvitedCourseItem from './InvitedCourseItem'
import { Typography } from '@material-ui/core';

export default function InviteCourseDialog({
    open,
    setOpen,
    addCourse,
    invites
}){

    return (
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>
                Invited Courses
            </DialogTitle>
            <DialogContent>
                {invites.length === 0 && 
                    <DialogContentText>
                        No pending invites.
                    </DialogContentText>
                }
                <Grid container
                    direction="column"
                    justify="flex-start"
                    alignItems="center">
                    {invites.map(invite => (
                        <InvitedCourseItem key={invite.id} invite={invite} addCourse={addCourse}/>
                    ))}
                </Grid>
            </DialogContent>
        </Dialog>
    )
}