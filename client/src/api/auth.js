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
        if(response.status !== 200)
            return null
        if(!isLoggedIn())
            return null
        return response.data.user
    })
}

export function setToken(token){
    return localStorage.setItem("token", token)
}

export function getToken(){
    return localStorage.getItem("token")
}

export function isLoggedIn(){
    return getToken() !== null;
}