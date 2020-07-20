import React from 'react'
import { Card, CardContent, Typography, CardHeader, IconButton, MenuItem } from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert';

export default function ProjectListItem(props){
    const {project, openEditMenu} = props

    function handleOpen(event){
        openEditMenu(event, project.id)
    }

    return (
        <Card style={{margin: "8px"}}>
            <CardHeader
                    title={project.name}
                    action={
                        <IconButton onClick={handleOpen}>
                            <MoreVertIcon />
                        </IconButton>
                    }
                />
            <CardContent>
                {/* <Typography variant="h6">
                    {project.name}
                </Typography> */}
                <Typography>
                    {project.description}
                    <br />
                    {new Date(project.start_date).toLocaleString()} - {new Date(project.due_date).toLocaleString()}
                </Typography>
            </CardContent>
        </Card>
    )
}