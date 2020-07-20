import React, { useState } from 'react'
import { Menu, MenuItem } from '@material-ui/core';
import { deleteProject as svcDeleteProject} from '../../api/projectService';



export default function VertEdit(props){
    const { handleClose, anchorEl, projectID, deleteProject } = props

    function handleDelete(event){
        event.preventDefault()
        svcDeleteProject(projectID)
        .then(data  => {
            deleteProject(projectID)
            handleClose()
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
        </Menu>
    )
}