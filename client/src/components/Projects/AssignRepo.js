import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, TextField, DialogActions, Button, Typography } from "@material-ui/core"
import Autocomplete from '@material-ui/lab/Autocomplete'
import { getRepos } from '../../api/projectService'

export default function AssignRepo(props){
    const {handleClose, project} = props
    const [repos, setRepos] = useState([])

    useEffect(() => {
        getRepos()
        .then(data => {
            setRepos(data)
        })
    }, [])

    return (
        <React.Fragment>
            {project && (
            <Dialog open={Boolean(project)} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Assign a repo to {project.name}
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Type: {project.type}
                    </Typography>
                    {project.user_group.users && (
                        <Typography>
                            Group
                            <ul style={{marginTop: "0"}}>
                                {project.user_group.users.map((user) => (
                                    <li key={user.id}>{user.username}</li>
                                ))}
                            </ul>
                        </Typography>
                    )}
                    <Autocomplete 
                        id="repo-field"
                        options={repos}
                        getOptionLabel={(option) => option.full_name}
                        style={{ maxWidth: "90%", margin: "8px auto"}}
                        renderInput={(params) => <TextField {...params} label="Search repos" variant="outlined"/>}
                    />
                </DialogContent>
                <DialogActions>
                    <Button>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
            )}
        </React.Fragment>
    )
}