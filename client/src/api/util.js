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

export function formatDate(date){
    var options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return date.toLocaleDateString('en-US', options)
}