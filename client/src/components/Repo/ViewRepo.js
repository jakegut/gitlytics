import React, { useEffect, useState } from 'react'
import { Grid, Typography, Container, TableContainer, Paper, Table, TableHead, TableCell, TableRow, TableBody, CircularProgress } from '@material-ui/core';
import { getGitdata } from '../../api/projectService';

export default function ViewRepo(props){
    const {repo} = props;
    const [gitdata, setGitdata] = useState(null)

    useEffect(() => {
        getGitdata(repo.id)
        .then(data => {
            setGitdata(data.gitdata)
        })
    }, [repo])

    return (
        <Container maxWidth="lg" fixed>
            <Grid container style={{margin: "8"}}>
                <Grid item xs={12}>
                    <Typography variant="h3">
                        Stats for: {repo.name}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    {gitdata ? (
                    <TableContainer component={Paper}>
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
                            <TableBody>
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
                    ) : <CircularProgress />}
                </Grid>
            </Grid>
        </Container>
    )
}