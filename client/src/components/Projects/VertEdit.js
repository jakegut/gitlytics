import React, { useState } from 'react'
import { Menu, MenuItem } from '@material-ui/core';
import { deleteProject as svcDeleteProject} from '../../api/projectService';
import { updateRepoCommits } from '../../api/statsService';



export default function VertEdit(props){
    const { handleClose, anchorEl, projectID, deleteProject } = props

    function handleDelete(event){
        event.preventDefault()
        // svcDeleteProject(projectID)
        // .then(data  => {
        //     deleteProject(projectID)
        //     handleClose()
        // })
        deleteProject(projectID)
        handleClose()
    }

    function handleUpdate(event){
        event.preventDefault()
        updateRepoCommits(projectID)
        .then(data => {
            console.log(data)
        })
    }

    return(
        <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
            <MenuItem onClick={handleUpdate}>Update Repo Commits</MenuItem>
        </Menu>
    )
}