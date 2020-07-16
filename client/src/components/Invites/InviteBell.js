import React, { useState, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import MailIcon from '@material-ui/icons/Mail';
import Badge from '@material-ui/core/Badge';
import { getUserInvites } from '../../api/userService';
import InviteCourseDialog from './InviteCourseDialog'
import { acceptInvite } from '../../api/courseService';

export function InviteBell({setCourses}){

    const [invitedCourses, setInvitedCourses] = useState([])
    const [open, setOpen] = useState(false);

    useEffect(() => {
        getUserInvites()
        .then(data => {
            setInvitedCourses(data.invites)
        })
    }, [])


    function addCourse(invite_id){
        acceptInvite(invite_id)
        .then(data => {
            setCourses(courses => courses.concat(data.course))
            setOpen(false)
            setInvitedCourses(invitedCourses.filter(i => i.id !== invite_id))
        })
    }

    return (
        <span>
            <IconButton aria-label="invites" onClick={() => setOpen(true)}>
                <Badge badgeContent={invitedCourses.length} color="secondary">
                    <MailIcon />
                </Badge>
            </IconButton>
            {invitedCourses !== undefined && <InviteCourseDialog open={open} setOpen={setOpen} invites={invitedCourses} addCourse={addCourse} />}
        </span>
    )
}