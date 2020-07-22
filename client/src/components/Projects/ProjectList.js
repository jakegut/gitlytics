import React, { useState } from 'react'
import ProjectListItem from './ProjectListItem'
import VertEdit from './VertEdit';
import AssignRepo from './AssignRepo';

export default function ProjectList(props){
    const {projects, deleteProject} = props
    const [anchorEl, setAnchorEl] = useState(null);
    const [projectID, setProjectID] = useState(null);
    const [project, setProject] = useState(null)

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

    function handleDialogClose(){
        setProject(null)
    }

    function openDialog(project){
        setProject(project)
    }

    return (
        <div>
            {projects.map(project => (
                <ProjectListItem key={project.id} project={project} openEditMenu={openEditMenu} openAssignRepo={openDialog} />
            ))}
            <VertEdit handleClose={handleClose} anchorEl={anchorEl} projectID={projectID} deleteProject={removeProject}/>
            <AssignRepo handleClose={handleDialogClose} project={project} />
        </div>
    )
}