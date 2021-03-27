import React, { useContext } from 'react'
import { Typography, Button, CardContent, CardActions, Card, CardHeader, IconButton } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { UserContext } from '../../UserContext';
import Grid from '@material-ui/core/Grid'
import LinkButton from '../LinkButton'

export default function CourseListItem({course}){

    const {user} = useContext(UserContext)

    function isOwner(){
        return user.owned_courses.includes(course.id)
    }
    return(
        <Grid item xs={12} sm={6} md={4} >
            <Card style={{margin: "8px"}}>
            <CardHeader
                title={course.name}
                action={ isOwner() && (
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                )
                }
            />
            <CardContent style={{minHeight: "150px"}}>
                <Typography>
                    Owned by: {course.owner.username}
                </Typography>
            </CardContent>
            <CardActions>
                <LinkButton to={`/main/courses/${course.id}`}>
                Go to course
                </LinkButton>
            </CardActions>
            </Card>
        </Grid>
    )
}