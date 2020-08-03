import axios from 'axios'
import {getAxiosConfig, getDownloadConfig} from './util'

export function getRepoCommits(repo_id, days){
    return axios.get(`/stats/repo/${repo_id}/commits?days=${days}`, getAxiosConfig())
    .then(response => {
        return response.data
    })
}

export function getRepoContribs(repo_id, days){
    return axios.get(`/stats/repo/${repo_id}/contributions?days=${days}`, getAxiosConfig())
    .then(response => {
        return response.data
    })
}

export function getRepoTotalContribs(repo_id, days){
    return axios.get(`/stats/repo/${repo_id}/total_contributions?days=${days}`, getAxiosConfig())
    .then(response => {
        return response.data
    })
}

export function updateRepoCommits(proj_id){
    return axios.put(`/stats/project/${proj_id}/populate`, {}, getAxiosConfig())
    .then(response => {
        return response.data
    })
}

export function getProjectCsv(proj_id){
    return axios.get(`/stats/project/${proj_id}/csv`, getDownloadConfig())
}