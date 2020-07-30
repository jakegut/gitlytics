import React, { useEffect, useState } from 'react'
import { Grid, Typography, Container, TableContainer, Paper, Table, TableHead, TableCell, TableRow, TableBody, CircularProgress, Select, MenuItem } from '@material-ui/core';
import { getGitdata } from '../../api/projectService';
import RepoCommits from '../Stats/RepoCommits';
import RepoContributions from '../Stats/RepoContributions';
import RepoTotalContributions from '../Stats/RepoTotalContributions';

export default function ViewRepo(props){
    const {repo} = props;
    const [gitdata, setGitdata] = useState(null)
    const [value, setValue] = useState(30)

    useEffect(() => {
        setValue(30)
        setGitdata(null)
        getGitdata(repo.id)
        .then(data => {
            setGitdata(data.gitdata)
        })
    }, [repo])

    function handleChange(event){
        setValue(event.target.value)
    }

    return (
        <Container maxWidth="xl" fixed>
            <Grid container style={{margin: "8"}} spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h3">
                        Stats for: {repo.name}
                    </Typography>
                    <Select value={value} onChange={handleChange}>
                        <MenuItem value={30}>30 days</MenuItem>
                        <MenuItem value={60}>60 days</MenuItem>
                        <MenuItem value={90}>90 days</MenuItem>
                    </Select>
                </Grid>
                {gitdata ? (
                <Grid item xs={12}>
                    
                    <TableContainer component={Paper} style={{overflowY: "auto", height: "500px"}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>SHA</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Contributor</TableCell>
                                    <TableCell>Additions</TableCell>
                                    <TableCell>Deletions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody >
                                {gitdata.map(data => (
                                    <TableRow key={data.sha}>
                                        <TableCell component="th" scope="row">{data.sha}</TableCell>
                                        <TableCell>{data.date}</TableCell>
                                        <TableCell>{data.contributor_user}</TableCell>
                                        <TableCell>{data.additions}</TableCell>
                                        <TableCell>{data.deletions}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    
                </Grid> ) : <CircularProgress />}

                <Grid item xs={12}>
                    <RepoCommits repo_id={repo.id} days={value}/>
                </Grid>
                <Grid item xs={12}>
                    <RepoContributions repo_id={repo.id} days={value}/>
                </Grid>
                <Grid item xs={6}>
                    <RepoTotalContributions repo_id={repo.id} days={value}/>
                </Grid>
            </Grid>
        </Container>
    )
}