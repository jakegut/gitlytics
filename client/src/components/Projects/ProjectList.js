import React, { useState } from 'react'
import { render } from '@testing-library/react'
import ProjectListItem from './ProjectListItem'
import VertEdit from './VertEdit';

export default function ProjectList(props){
    const {projects, deleteProject} = props
    const [anchorEl, setAnchorEl] = useState(null);
    const [projectID, setProjectID] = useState(null);

    function openEditMenu(event, projectId){
        setAnchorEl(event.currentTarget)
        setProjectID(projectId)
    }

    function handleClose(){
        setAnchorEl(null)
        setProjectID(null)
    }

    function removeProject(id){
        deleteProject(id)
    }

    return (
        <div>
            {projects.map(project => (
                <ProjectListItem key={project.id} project={project} openEditMenu={openEditMenu}/>
            ))}
            <VertEdit handleClose={handleClose} anchorEl={anchorEl} projectID={projectID} deleteProject={removeProject}/>
        </div>
    )
}