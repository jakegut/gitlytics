import React, { useEffect, useState } from 'react'
import { getRepoCommits } from '../../api/statsService';
import { LineChart, CartesianGrid, Tooltip, YAxis, Legend, Line, XAxis } from 'recharts';

export default function RepoCommits(props){
    const {repo_id} = props;
    const [data, setData] = useState(null)

    useEffect(() => {
        getRepoCommits(repo_id)
        .then(d => {
            setData(d.result)
        })
    }, []);

    return (
        <React.Fragment>
            {data && (
                <LineChart width={730} height={250} data={data.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" type="number" scale="time"/>
                    <YAxis />
                    <Tooltip contentStyle={{backgroundColor: "#424242"}}/>
                    <Legend />
                    {data.lines.map((line) => (
                        <Line key={line} dataKey={line} />
                    ))}
                </LineChart>
            )}
        </React.Fragment>
    )
}