import {getToken, setToken} from './auth'

export function getAxiosConfig(){
    return {
        headers: {
            "Content-Type": 'application/json',
            "Authorization": `Bearer ${getToken()}`
        },
        responseType: "json"
    }
}