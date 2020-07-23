import axios from 'axios'
import {getAxiosConfig} from './util'

export function createProject(data){
    return axios.post("/projects/", data, getAxiosConfig())
    .then(response => {
        return response.data
    })
}

export function deleteProject(projectId){
    return axios.delete(`/projects/${projectId}`, getAxiosConfig())
    .then(response => {
        return response.data
    })
}

export function getRepos(){
    return axios.get("/projects/search/repo", getAxiosConfig())
    .then(response => {
        return response.data
    })
}

export function addRepo(project_id, repo_name){
    return axios.post(`/projects/${project_id}/repos`, {repo_name}, getAxiosConfig())
    .then(response => {
        return response.data
    })
}