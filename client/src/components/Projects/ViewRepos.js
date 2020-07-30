import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProjectRepo } from '../../api/projectService'
import { Container, Typography, TextField, Grid } from '@material-ui/core'
import GroupIcon from '@material-ui/icons/Group';
import Autocomplete from '@material-ui/lab/Autocomplete'
import ViewRepo from '../Repo/ViewRepo'

export default function ViewRepos(){
    const {course_id, project_id} = useParams()
    const [repos, setRepos] = useState(null)
    const [repo, setRepo] = useState(null)
    const [type, setType] = useState(null)

    useEffect(() => {
        getProjectRepo(project_id)
        .then(data => {
            if(data.repos){
                setRepos(data.repos)
                setType(data.type)
            }
            else
                setRepo(data.repo)
        })
    }, [])

    return (
        <Container>
            {repos && (
                <Container maxWidth="md" fixed>
                <Grid container>
                    <Grid item xs={12}>
                        <Autocomplete 
                            id="repo-select"
                            options={repos}
                            getOptionLabel={(option) => option.name}
                            onChange={(e, v) => setRepo(v)}
                            groupBy={(option) => (type.includes('group')) ? (option.group) ? option.group.id :  null : null}
                            renderInput={(params) => <TextField {...params} label="Repos" variant="outlined" />}
                        />
                    </Grid>
                </Grid>
                </Container>
            )}
            {repo && (
                <ViewRepo repo={repo} />
            )}
        </Container>
    )
}