import React, { useState } from 'react'
import { Menu, MenuItem } from '@material-ui/core';
import { updateRepoCommits, getProjectCsv } from '../../api/statsService';
import { downloadFile } from '../../api/util';



export default function VertEdit(props){
    const { handleClose, anchorEl, projectID, deleteProject } = props

    function handleDelete(event){
        event.preventDefault()
        deleteProject(projectID)
        handleClose()
    }

    function handleUpdate(event){
        event.preventDefault()
        updateRepoCommits(projectID)
        .then(data => {
            console.log(data)
            handleClose()
        })
    }

    function handleCSV(event){
        event.preventDefault()
        getProjectCsv(projectID)
        .then(response => {
            downloadFile(response.data, "data.csv")
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
            <MenuItem onClick={handleUpdate}>Update Repo Commits</MenuItem>
            <MenuItem onClick={handleCSV}>Download CSV data</MenuItem>
        </Menu>
    )
}