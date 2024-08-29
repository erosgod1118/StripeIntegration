import axios from "axios"

const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL

export const postRequest = (path, data) => {
    return axios.post(`${SERVER_BASE_URL}${path}`, data, {
        headers: {
            "Content-Type": "application/json",
        },
    })
}

export const getRequest = (pPath, pToken = null) => {
    const headers = {
        "Content-Type": "application/json",
    }

    if (pToken) {
        headers['Authorization'] = `Bearer ${pToken}`
    } console.log("Headers: ", headers)

    return axios.get(`${SERVER_BASE_URL}${pPath}`, {
        headers: headers
    })
}