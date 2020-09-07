import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import { Typography, Button, CardContent, CardActions, Card, IconButton, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add'
import { Link } from 'react-router-dom'
import {getCourses} from '../../api/courseService'
import { useLoader } from '../../LoadContext';
import { InviteBell } from '../Invites/InviteBell';
import CoursesListItem from './CourseListItem'

export default function CoursesList(){

  const [courses, setCourses] = useState([])
  const [ownedCourses, setOwnedCourses] = useState([])
  const { dispatch } = useLoader()

  useEffect(() => {
    dispatch("LOADING")
    getCourses()
    .then(data => {
      setCourses(data.courses)
      setOwnedCourses(data.owned_courses)
      dispatch("FINISHED")
    })
  }, [])

  return(
    <Container maxWidth="lg">
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
      >
        <Grid item xs={12}>
          <Typography variant="h4">
            Courses
            <InviteBell setCourses={setCourses}/>
          </Typography>
          {courses.length === 0 && <Typography>No courses available</Typography>}
          <Grid container>
            {courses.map(course => (
              <CoursesListItem key={course.id} course={course}/>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4">
            Owned Courses
            <Tooltip title="Create a course">
              <IconButton tooltip="Create a Course" component={Link} to="/main/courses/create">
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Typography>
        </Grid>
        <Grid container>
          {ownedCourses.length === 0 && <Typography>No courses available</Typography>}
          {ownedCourses.map(course => (
            <CoursesListItem key={course.id} course={course}/>
          ))}
        </Grid>
      </Grid>
    </Container>
  )
}