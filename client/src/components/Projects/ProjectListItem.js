import React, { useContext } from 'react'
import { Card, CardContent, Typography, CardHeader, IconButton, MenuItem, CardActions, Button } from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { UserContext } from '../../UserContext';
import { useParams } from 'react-router-dom';
import { formatDate } from '../../api/util';

export default function ProjectListItem(props){
    const {project, openEditMenu, openAssignRepo} = props

    const {user} = useContext(UserContext)

    function handleOpen(event){
        openEditMenu(event, project.id)
    }

    function isOwner(){
        return user.owned_courses.includes(project.course_id)
    }

    function handleDialogOpen(event){
        event.preventDefault()
        openAssignRepo(project)
    }

    return (
        <Card style={{margin: "8px"}}>
            <CardHeader
                    title={project.name}
                    action={ isOwner() && (
                        <IconButton onClick={handleOpen}>
                            <MoreVertIcon />
                        </IconButton>
                    )
                    }
                />
            <CardContent>
                {/* <Typography variant="h6">
                    {project.name}
                </Typography> */}
                <Typography>
                    {project.description}
                    <br />
                    {formatDate(new Date(project.start_date))} - {formatDate(new Date(project.due_date))}
                </Typography>
            </CardContent>
            <CardActions>
                {isOwner() && (
                    <Button>
                        View project
                    </Button>
                )}
                {Object.keys(project.user_repo).length === 0 ? (
                    <Button onClick={handleDialogOpen}>
                        Assign a Repo
                    </Button>
                ) : (
                    <Button>
                        View Repo: {project.user_repo.name}
                    </Button>
                )}
            </CardActions>
        </Card>
    )
}