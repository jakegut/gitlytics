import React from 'react';
import Button from '@material-ui/core/Button'
import {useHistory} from 'react-router-dom';

export default function LinkButton({to, children, ...rest}){
    const history = useHistory()

    return(
        <Button
            onClick={((event) => history.push(to))}
            {...rest}
        >
            {children}
        </Button>
    )
}