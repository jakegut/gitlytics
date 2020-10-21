import React, { useEffect, useState } from 'react'
import { Container, Grid, Typography, TextField, FormControl, RadioGroup, FormControlLabel, Radio, FormLabel, Button } from '@material-ui/core';
import GroupDnd from './GroupDnd';
import { getStudents } from '../../api/courseService';
import { useParams, useHistory } from 'react-router-dom';
import { useForm } from '../Hooks';
import { DateTimePicker } from '@material-ui/pickers';
import { createProject } from '../../api/projectService'

export default function CreateProject(){
    const [groups, setGroups] = useState(null)
    const [form, handleChange, handleDate] = useForm({type: "individual", start_date: new Date(), due_date: new Date()})

    const history = useHistory()

    const {course_id} = useParams()

    useEffect(() => {
        getStudents(course_id)
        .then(data => {
            setGroups([data.students])
        })
    }, [])

    function handleSubmit(e){
        e.preventDefault()
        let cpy = {...form}
        cpy.course_id = course_id
        cpy.start_date = form.start_date.toISOString(true)
        cpy.due_date = form.due_date.toISOString(true)
        if(cpy.type.includes("group") && checkGroupMin()){
            let groupData = groups.slice(1)
            cpy = {...cpy, groups: groupData}
        }
        createProject(cpy)
        .then(data => {
            history.push(`/main/courses/${course_id}`)
        })
    }

    function checkGroupMin(){
        if(form.type.includes("group"))
            return groups.slice(1).length > 0 && groups[1].length > 0
        return true
    }

    return (
    <Container maxWidth="md" fixed>
        <Grid
        container
        direction="row"
        justify="center"
        alignItems="flex-start"
        >

        <Grid item xs={12}>
            <Typography variant="h4">
                Create Project
            </Typography>
        </Grid>
        <Grid item xs={10}>
            <form>
            <TextField
                label="Name" 
                required
                fullWidth
                style={{margin: "8px"}}
                value={form.name || ""}
                name="name"
                onInput={handleChange}
            />
            <TextField
                label="Description" 
                fullWidth
                style={{margin: "8px"}}
                value={form.description || ""}
                name="description"
                multiline
                onInput={handleChange}
            />
            <Grid container >
                <Grid item xs={12} sm={6}>
                    <DateTimePicker 
                        label="Start Date"
                        value={form.start_date || new Date()}
                        onChange={(date) => handleDate("start_date", date)}
                        name="due_date"
                        fullWidth
                        style={{margin: "8px"}}
                    />
                </Grid>
                <Grid item xs={12} sm={6}  >
                    <DateTimePicker 
                        label="Due Date"
                        disablePast
                        minDate={form.start_date}
                        minDateMessage="Date should be after start date"
                        value={form.due_date || new Date()}
                        onChange={(date) => handleDate("due_date", date)}
                        name="due_date"
                        fullWidth
                        style={{margin: "8px"}}
                    />
                </Grid>
            </Grid>
            <FormControl error={!checkGroupMin()} component="fieldset" style={{margin: "8px"}}>
                <FormLabel component="legend">Type</FormLabel>
                <RadioGroup aria-label="gender" name="type" value={form.type || "individual"} onChange={handleChange}>
                    <FormControlLabel value="individual" control={<Radio />} label="Individual" />
                    <FormControlLabel value="group_ind" control={<Radio />} label="Group with indvidual repos" />
                    <FormControlLabel value="group_group" control={<Radio />} label="Group with a group repo" />
                </RadioGroup>
            </FormControl>

            {form.type && form.type.includes("group") && (
            <GroupDnd items={groups} setItems={setGroups}/>
            )}
            <br />
            <Button type="submit" onClick={handleSubmit} disabled={!checkGroupMin()}>
                Submit
            </Button>

            </form>
        </Grid>
        
        
        </Grid>
    </Container>
    )
}