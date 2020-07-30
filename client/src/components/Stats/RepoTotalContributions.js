import React, { useEffect, useState } from 'react'
import { Paper, Typography } from '@material-ui/core';
import { ResponsiveContainer, PieChart, Pie, Legend, Tooltip, Cell } from 'recharts';
import { getRepoTotalContribs } from '../../api/statsService';

export const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#0088FE'];

export default function RepoTotalContributions(props){
    const {repo_id, days} = props;
    const [data, setData] = useState(null)

    useEffect(() => {
        setData(null)
        getRepoTotalContribs(repo_id, days)
        .then(data => {
            setData(data.data)
        })
    }, [repo_id, days])

    return (
        <React.Fragment>
            {data && (
                <Paper style={{padding: "8px"}}>
                    <Typography variant="h5" style={{widht: "100%", textAlign: "center", marginTop: "8px"}}>
                        Total contributions
                    </Typography>
                    <ResponsiveContainer height={300}>
                        <PieChart>
                            <Pie 
                                data={data}
                                dataKey="commits"
                                nameKey="name"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={2}
                                startAngle={-270}
                                endAngle={90}
                                cx="50%" cy="50%" 
                            >
                                {data.map((d, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]}/>
                                ))}

                            </Pie>
                            <Legend />
                            <Tooltip contentStyle={{backgroundColor: "#363636", borderRadius: "5px", border: "none"}} itemStyle={{color: "#fff"}}/>
                        </PieChart>
                    </ResponsiveContainer>
                </Paper>
            )}
        </React.Fragment>
    )
}