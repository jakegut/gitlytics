import React from 'react'
import { CircularProgress } from '@material-ui/core'

const initialState = {
    "isLoading": false
}

const reducer = (state, action) => {
    switch(action) {
        case "FINISHED":
            return {
                ...state,
                isLoading: false
            }
        case "LOADING":{
            return {
                ...state,
                isLoading: true
            }
        }
        default:
            return state;
    }
}

const LoadContext = React.createContext()

export const LoadProvider = ({children}) => {
    const [state, dispatch ] = React.useReducer(reducer, initialState)

    const contextValue = React.useMemo(() => { return {state, dispatch}}, [state, dispatch])

    const {isLoading} = state;

    return (
        <LoadContext.Provider value={contextValue}>
            {isLoading && (<div style={{
                position: "fixed",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(16, 16, 16, 0.5)",
                zIndex: '99'
            }}>
                <CircularProgress style={{
                    position: 'fixed',
                    top: '50vh',
                    right: '50vw'
                }} size={60}/>
            </div>) }
            {children}
        </LoadContext.Provider>
    )
}

export function useLoader(){
    return React.useContext(LoadContext)
}