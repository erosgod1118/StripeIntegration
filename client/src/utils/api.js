import axios from "axios"

const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL

export const postRequest = (path, data) => {
    const headers = {
        "Content-Type": "application/json",
    }
    
    const token = localStorage.getItem("token")
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    return axios.post(`${SERVER_BASE_URL}${path}`, data, {
        headers: headers,
    })
}

export const getRequest = (pPath) => {
    const headers = {
        "Content-Type": "application/json",
    }

    const token = localStorage.getItem("token")
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    return axios.get(`${SERVER_BASE_URL}${pPath}`, {
        headers: headers,
    })
}