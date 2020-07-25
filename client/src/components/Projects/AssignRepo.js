import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, TextField, DialogActions, Button, Typography, CircularProgress, makeStyles } from "@material-ui/core"
import Autocomplete from '@material-ui/lab/Autocomplete'
import { getRepos, addRepo } from '../../api/projectService'

const useStyles = makeStyles((theme) => ({
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonProgress: {
      color: 'white',
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  }));

export default function AssignRepo(props){
    const {handleClose, project, setAssignedRepo} = props

    const classes = useStyles();
    const [repos, setRepos] = useState([])
    const [repo, setRepo] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getRepos()
        .then(data => {
            setRepos(data)
        })
    }, [])

    function createRepo(event){
        setLoading(true)
        event.preventDefault()
        addRepo(project.id, repo.full_name)
        .then(data => {
            setAssignedRepo(project.id, data.repo)
            setLoading(false)
            handleClose();
        })
        .catch(error => {
            console.log(error.response)
            setLoading(false)
        })
    }

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
                        <Typography component={'span'}>
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
                        onChange={(e, v) => setRepo(v)}
                        renderInput={(params) => <TextField {...params} label="Search repos" variant="outlined"/>}
                    />
                    <Typography>
                        If you don't see the repository for this project, ask the repository owner to add it.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <div className={classes.wrapper}>
                        <Button onClick={createRepo} disabled={loading}>
                            Submit
                        </Button>
                        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </div>
                </DialogActions>
            </Dialog>
            )}
        </React.Fragment>
    )
}