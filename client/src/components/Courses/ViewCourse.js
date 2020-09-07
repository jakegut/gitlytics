import React, { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { Container, Grid, Typography, IconButton } from '@material-ui/core';
import { getCourse } from '../../api/courseService';
import { useLoader } from '../../LoadContext';
import AddIcon from '@material-ui/icons/Add'
import InviteUserDialog from '../Invites/InviteUserDialog';
import ProjectList from '../Projects/ProjectList';
import ConfirmDeleteDialog from '../Projects/ConfirmDeleteDialog';
import { delProject } from '../../api/projectService'

export default function ViewCourse(){
    const {course_id} = useParams();
    const [data, setData] = useState({})
    const { state, dispatch } = useLoader()

    const [inviteDialogOpen, setInviteOpen] = useState(false)
    const [projectId, setProjectId] = useState(null)

    const history = useHistory()

    useEffect(() => {
        dispatch("LOADING")
        getCourse(course_id)
        .then(data => {
            setData(data)
            dispatch("FINISHED")
        })
        .catch(error => {
            history.push('/main/courses')
        })
    }, [])

    function goToCreateProject(e){
        history.push(`/main/courses/${course_id}/p/create`)
    }

    function addInvites(d){
        let cpy = {...data}
        cpy.invites = cpy.invites.concat(d.invites)
        setData(cpy)
    }

    function deleteProject(id){
        setProjectId(id)
    }

    function finalDeleteProject(){
        delProject(projectId)
        .then(d => {
            let cpy = {...data}
            cpy.course.projects = cpy.course.projects.filter(p => p.id !== projectId)
            setData(cpy)
            setProjectId(null)
        })
    }

    function replaceProject(project_id, proj){
        let cpy = {...data}
        let idx = cpy.course.projects.findIndex(el => el.id === project_id)
        cpy.course.projects[idx] = proj
        setData(cpy)
    }

    return (
        <Container maxWidth="lg">
        {data.course !== undefined && (
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
            >
                <Grid item xs={12}>
                    <Typography variant="h3">
                        {data.course.name}
                    </Typography>
                </Grid>
                <Grid item sm={12} md={6}>
                    <Typography variant="h4">
                        Projects
                        {data.invites !== undefined && (
                            <IconButton onClick={goToCreateProject}>
                                <AddIcon />
                            </IconButton>
                        )}
                    </Typography>
                    {data.course.projects && <ProjectList projects={data.course.projects} deleteProject={deleteProject} replaceProject={replaceProject} />}
                    <ConfirmDeleteDialog projectId={projectId} handleClick={finalDeleteProject} handleClose={(e) => setProjectId(null)}/>
                </Grid>
                <Grid item sm={12} md={6}>
                    <Typography variant="h4">
                        Students
                    </Typography>
                    {data.course.users.map(user => (
                        <Typography key={user.id}>
                            {user.username}
                        </Typography>
                    ))}
                    {data.course.users.length === 0 && (
                        <Typography>
                            No students
                        </Typography>
                    )}
                    {data.invites !== undefined && (
                        <div>
                            <Typography variant="h5">
                                Invited Students
                                <IconButton onClick={() => setInviteOpen(true)}>
                                    <AddIcon/>
                                </IconButton>
                            </Typography>
                            <InviteUserDialog open={inviteDialogOpen} setOpen={setInviteOpen} courseId={data.course.id} addInvites={addInvites}/>
                            <div>
                            {data.invites.length === 0 && (
                                <Typography>
                                    No invites
                                </Typography>
                            )}
                            </div>
                            <div>
                            {data.invites.map(invite => (
                                <Typography key={invite.id}>
                                    {invite.username}
                                </Typography>
                            ))}
                            </div>
                        </div>
                    )}
                </Grid>
            </Grid>
        
        )} 
        </Container>
    )
}