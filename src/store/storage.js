import axios from 'axios' 
import {TOWNS_API_ENDPOINT, TOWNS_API_KEY, SESSION_INFO_KEY, PROFILE_INFO_KEY} from '../env/env'

// Towns API

export const init = async () => {    
    let data = (await axios.get(TOWNS_API_ENDPOINT)).data

    localStorage.setItem(TOWNS_API_KEY, JSON.stringify(data))
}

export const gain = () => {
    return JSON.parse(localStorage.getItem(TOWNS_API_KEY))
}

// Persist Session Information 

export const onUpdateName = (name, timestamp) => {
    localStorage.setItem(SESSION_INFO_KEY, JSON.stringify({name, timestamp}))
}

export const onGetName = () => {
    let data = localStorage.getItem(SESSION_INFO_KEY)

    return data !== null ? JSON.parse(data) : null 
}

// Persist Profile Information

export const onUpdateProfile = (profile) => {
    sessionStorage.setItem(PROFILE_INFO_KEY, JSON.stringify(profile))
}

export const onGetProfile = () => {
    let data = sessionStorage.getItem(PROFILE_INFO_KEY)

    return data !== null ? JSON.parse(data) : null 
}