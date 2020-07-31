import React from 'react'
import { Dialog, DialogTitle, DialogActions, Button, DialogContent } from '@material-ui/core'

export default function ConfirmDeleteDialog(props){
    const {projectId, handleClick, handleClose} = props

    return (
        <Dialog open={Boolean(projectId)} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Delete project
            </DialogTitle>
            <DialogContent>
                Are you sure you want to delete this project? This will remove all data associated with each repository.
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClick}>
                    Yes
                </Button>
                <Button onClick={handleClose}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}