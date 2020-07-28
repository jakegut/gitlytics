import axios from 'axios'
import {getAxiosConfig} from './util'

export function getRepoCommits(repo_id){
    return axios.get(`/stats/repo/${repo_id}/commits`, getAxiosConfig())
    .then(response => {
        return response.data
    })
}

export function getRepoContribs(repo_id){
    return axios.get(`/stats/repo/${repo_id}/contributions`, getAxiosConfig())
    .then(response => {
        return response.data
    })
}

export function getRepoTotalContribs(repo_id){
    return axios.get(`/stats/repo/${repo_id}/total_contributions`, getAxiosConfig())
    .then(response => {
        return response.data
    })
}