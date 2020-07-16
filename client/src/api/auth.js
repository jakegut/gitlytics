import axios from 'axios'
import {getAxiosConfig} from './util'

export function retrieveAccessTokenAndUser(code){
    return axios.post("/auth/token", {"code": code}, getAxiosConfig())
    .then(response => {
        return response.data;
    })
}

export function retrieveUser(token){
    return axios.get("/auth/user", getAxiosConfig())
    .then(response => {
        if(response.status != 200)
            return null
        return response.data.user
    })
    .catch((err) => {return null});
    
}

export function setToken(token){
    return localStorage.setItem("token", token)
}

export function getToken(){
    return localStorage.getItem("token")
}