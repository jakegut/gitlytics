import React, {useState} from 'react'
import { Grid, CardContent, CardActions, IconButton, Card, Typography } from '@material-ui/core'
import CheckIcon from '@material-ui/icons/Check'
import ClearIcon from '@material-ui/icons/Clear'

export default function InvitedCourseItem({
    invite,
    addCourse
}){

    return(
        <Grid item xs={8} sm={6} style={{minWidth: "80%", margin: "8px"}}>
            <Card >
            <CardContent>
                <Typography variant="h6">
                    {invite.course.name}
                </Typography>
                <Typography>
                    Owned by {invite.course.owner.username}
                </Typography>
            </CardContent>
            <CardActions>
                <IconButton onClick={() => addCourse(invite.id)}>
                    <CheckIcon />
                </IconButton>
                <IconButton>
                    <ClearIcon  />
                </IconButton>
            </CardActions>
            </Card>
        </Grid>
    )
}