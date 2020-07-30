import React, { useEffect, useState } from 'react'
import { getRepoCommits } from '../../api/statsService';
import { LineChart, CartesianGrid, Tooltip, YAxis, Legend, Line, XAxis, ResponsiveContainer, Brush } from 'recharts';
import moment from 'moment';
import { Typography, Paper } from '@material-ui/core';
import { COLORS } from './RepoTotalContributions';

export default function RepoCommits(props){
    const {repo_id, days} = props;
    const [data, setData] = useState(null)

    useEffect(() => {
        setData(null)
        getRepoCommits(repo_id, days)
        .then(d => {
            setData(d.result)
        })
        .catch(err => console.log(err))
    }, [repo_id, days]);

    return (
        <Paper style={{padding: "8px"}}>
            <Typography variant="h5" style={{widht: "100%", textAlign: "center", marginTop: "8px"}}>
                Commits over time
            </Typography>
            {data && (
                <ResponsiveContainer height={400}>
                    <LineChart key={"HEELP" + repo_id} syncId="repo" data={data.data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid />
                        <XAxis 
                            dataKey="date"
                            type="number"
                            scale="utc"
                            domain={['auto', 'auto']}
                            tickFormatter={(unixTime) => moment.utc(unixTime).format('MM-DD-YYYY')}
                            name='Time'
                            stroke="#bfbfbf"
                        />
                        <YAxis stroke = "#bfbfbf"/>
                        <Tooltip 
                            contentStyle={{backgroundColor: "#363636", borderRadius: "5px", border: "none"}}
                            labelFormatter={(unixTime) => moment.utc(unixTime).format('MM-DD-YYYY')}
                        />
                        <Legend />
                        {data.lines.map((line, i) => (
                            <Line key={line} dataKey={line} fill={COLORS[i % COLORS.length]} stroke={COLORS[i % COLORS.length]} type="monotone"/>
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            )}
        </Paper>
    )
}