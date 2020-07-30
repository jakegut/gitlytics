import React, { useState, useEffect } from 'react'
import { Typography, Select, MenuItem, Paper } from '@material-ui/core';
import { getRepoContribs } from '../../api/statsService';
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Area, AreaChart, Legend, Tooltip } from 'recharts';
import moment from 'moment'

export default function RepoContributions(props){
    const { repo_id, days } = props;
    const [data, setData] = useState([])
    const [value, setValue] = useState('')
    const [areaData, setAreaData] = useState(null)

    useEffect(() => {
        setAreaData(null)
        getRepoContribs(repo_id, days)
        .then(data => {
            setData(data.result)
            if(data.result.length > 0){
                setAreaData(data.result[0])
                setValue(data.result[0].name)
            }
        })
    }, [repo_id, days])

    function handleChange(event){
        setValue(event.target.value)
        findAreaData(event.target.value)
    }

    function findAreaData(v){
        let d = data.find(d => d.name === v)
        setAreaData(d)
    }

    return (
        <React.Fragment>
            {data && (
                <Paper style={{padding: "8px"}}>
                    <Typography variant="h5" style={{widht: "100%", textAlign: "center", marginTop: "8px"}}>
                        Contibutions over time for:
                        <Select style={{marginLeft:"8px"}} value={value} onChange={handleChange}>
                            {data.map(d => (
                                <MenuItem key={d.name} value={d.name}>{d.name}</MenuItem>
                            ))}
                        </Select>
                    </Typography>
                    {areaData && (
                    <ResponsiveContainer height={400}>
                        <AreaChart key={"HEELP" + value} syncId="repo" margin={{ top: 20, right: 30, left: 0, bottom: 0 }} data={areaData.data}>
                            <CartesianGrid />
                            <XAxis 
                                dataKey="date"
                                type="number"
                                scale="time"
                                domain={['auto', 'auto']}
                                tickFormatter={(unixTime) => moment.utc(unixTime).format('MM-DD-YYYY')}
                                name='Time'
                                stroke="#bfbfbf"
                            />
                            <YAxis stroke = "#bfbfbf"/>
                            <Tooltip 
                                active={true}
                                contentStyle={{backgroundColor: "#363636", borderRadius: "5px", border: "none"}}
                                labelFormatter={(unixTime) => moment.utc(unixTime).format('MM-DD-YYYY')}
                                stackId="1"
                            />
                            <Legend />
                            <Area type="monotone" dataKey="additions" stackId="1" stroke="#3cfc49" fill="#3cfc49"/>
                            <Area type="monotone" dataKey="deletions" stackId="1" stroke="#fc493c" fill="#fc493c" />
                        </AreaChart>
                    </ResponsiveContainer>
                    )}
                </Paper>
            )}
        </React.Fragment>
    )
}