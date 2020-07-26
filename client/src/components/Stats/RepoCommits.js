import React, { useEffect, useState } from 'react'
import { getRepoCommits } from '../../api/statsService';
import { LineChart, CartesianGrid, Tooltip, YAxis, Legend, Line, XAxis } from 'recharts';
import moment from 'moment';

export default function RepoCommits(props){
    const {repo_id} = props;
    const [data, setData] = useState(null)

    useEffect(() => {
        setData(null)
        getRepoCommits(repo_id)
        .then(d => {
            setData(d.result)
        })
        .catch(err => console.log(err))
    }, [repo_id]);

    return (
        <React.Fragment>
            {data && (
                <LineChart key={"HEELP" + repo_id} width={730} height={250} data={data.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="date"
                        type="number"
                        scale="utc"
                        domain = {['auto', 'auto']}
                        tickFormatter = {(unixTime) => moment(unixTime).format('MM-DD-YYYY')}
                        name = 'Time'
                    />
                    <YAxis />
                    <Tooltip 
                        contentStyle={{backgroundColor: "#424242"}}
                        labelFormatter={(unixTime) => moment(unixTime).format('MM-DD-YYYY')}
                    />
                    <Legend />
                    {data.lines.map((line) => (
                        <Line key={line} dataKey={line} />
                    ))}
                </LineChart>
            )}
        </React.Fragment>
    )
}