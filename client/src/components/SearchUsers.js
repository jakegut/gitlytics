import React, { useState, useEffect } from 'react'
import { Typography, Button, TextField, CircularProgress, Grid, Paper } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useDebounce } from './Hooks';
import { searchUser } from '../api/userService';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';

export default function SearchUsers({selectedUsers, onUserSelect, onUserRemove}){

    const [results, setResults] = useState([])
    const [isSearching, setIsSearching] = useState(false);
    const [input, setInput] = useState("")
    const [value, setValue] = useState("")
    const debouncedInput = useDebounce(input, 250)

    useEffect(() =>{
        if(debouncedInput){
            setIsSearching(true)
            searchUser(debouncedInput)
            .then(data => {
                setResults(data)
                setIsSearching(false)
            })
        } else
            setResults([])
    }, [debouncedInput])

    function handleUserSelect(event){
        onUserSelect(value)
        setValue("")
        setInput("")
    }

    return(
        <div style={{minWidth: "90%"}}>
            <Autocomplete 
                freeSolo
                style={{marginTop: "8px", marginBottom: "8px"}}
                options={results}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.login)}
                inputValue={input}
                value={value}
                loading={isSearching}
                onChange={(e, v) => setValue(v === null ? v : v.login)}
                onInputChange={(e, i) => setInput(i)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search Github Users"
                        variant="outlined"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                            <React.Fragment>
                                {isSearching ? <CircularProgress color="inherit" size={20} /> : null}
                                {value ? <IconButton size="small" onClick={handleUserSelect}><AddIcon /></IconButton> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                            ),
                        }}
                        />
                )}
                renderOption={(option => (
                    <Grid container alignItems="center">
                        <Grid item>
                            <img style={{maxHeight:"24px", marginRight: "8px", marginTop: "4px"}}src={option.avatar_url} />
                        </Grid>
                        <Grid item xs>
                            {option.login}
                        </Grid>
                    </Grid>
                ))}
            />
            
            <Typography>
                Selected Users
            </Typography>
            <Grid container>
            {selectedUsers.map(result => (
                <Grid container direction="row" key={result} style={{padding: "4px"}}>
                    <Grid item xs={1}>
                        <IconButton size="small" style={{float: "right"}} onClick={(event) => onUserRemove(result)}>
                            <ClearIcon/>
                        </IconButton>
                    </Grid>
                    <Grid item xs={10}>
                        <Typography >
                            {result}
                        </Typography>
                    </Grid>
                </Grid>
            ))
            }
            </Grid>
        </div>
    )
}