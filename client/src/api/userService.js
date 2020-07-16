import axios from 'axios'
import {getAxiosConfig} from './util'

export function searchUser(searchTerm){
    return axios.get(`/courses/search/student?user=${searchTerm}`, getAxiosConfig())
        .then(response => {
            return response.data
        })
}

export function getUserInvites(){
    return axios.get("/users/invites", getAxiosConfig())
        .then(response => {
            return response.data
        })
}