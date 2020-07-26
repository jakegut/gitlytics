import axios from 'axios'
import {getAxiosConfig} from './util'

export function getRepoCommits(repo_id){
    return axios.get(`/stats/repo/${repo_id}/commits`, getAxiosConfig())
    .then(response => {
        return response.data
    })
}