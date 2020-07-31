import React, { useState } from 'react'
import ProjectListItem from './ProjectListItem'
import VertEdit from './VertEdit';
import AssignRepo from './AssignRepo';
import { Typography } from '@material-ui/core';

export default function ProjectList(props){
    const {projects, deleteProject, replaceProject} = props
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

    function setAssignedRepo(project_id, repo){
        let proj = projects.find(p => p.id === project_id)
        proj.user_repo = repo
        replaceProject(proj)
    }

    return (
        <div>
            {projects.length === 0 && (
                <Typography>
                    No projects here
                </Typography>
            )}
            {projects.map(project => (
                <ProjectListItem key={project.id} project={project} openEditMenu={openEditMenu} openAssignRepo={openDialog} />
            ))}
            <VertEdit handleClose={handleClose} anchorEl={anchorEl} projectID={projectID} deleteProject={removeProject}/>
            <AssignRepo handleClose={handleDialogClose} project={project} setAssignedRepo={setAssignedRepo} />
        </div>
    )
}