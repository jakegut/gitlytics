import React from 'react'
import { Typography, Button, CardContent, CardActions, Card } from '@material-ui/core';
import Grid from '@material-ui/core/Grid'
import LinkButton from '../LinkButton'

export default function CourseListItem({course}){
    return(
        <Grid item xs={12} sm={6} md={4} >
            <Card style={{margin: "8px"}}>
            <CardContent style={{minHeight: "150px"}}>
                <Typography variant="h5">
                    {course.name}
                </Typography>
                <Typography>
                    Owned by: {course.owner.username}
                </Typography>
            </CardContent>
            <CardActions>
                <LinkButton color="primary" to={`/courses/${course.id}`}>
                Go to course
                </LinkButton>
            </CardActions>
            </Card>
        </Grid>
    )
}