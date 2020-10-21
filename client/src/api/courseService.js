import axios from 'axios'
import {getAxiosConfig} from './util'

export function createCourse(data){
    return axios.post("/courses/", data, getAxiosConfig())
    .then(response => {
        return response.data
    })
}

export function getCourses(){
    return axios.get("/courses/", getAxiosConfig())
    .then(response => {
        return response.data
    })
}

export function acceptInvite(invite_id){
    return axios.get("/invites/a/"+invite_id, getAxiosConfig())
    .then(response => {
        return response.data
    })
}

export function getCourse(course_id){
    return axios.get("/courses/"+course_id, getAxiosConfig())
    .then(response => {
        return response.data
    })
}

export function createInvite(data){
    return axios.post("/invites/create", data, getAxiosConfig())
    .then(response => {
        return response.data
    })
}

export function getStudents(course_id){
    return axios.get(`/courses/${course_id}/students`, getAxiosConfig())
    .then(response => {
        return response.data
    })
}

export function checkStudents(students){
    return axios.post('/courses/check', {students}, getAxiosConfig())
    .then(response => {
        return response.data
    })
}
