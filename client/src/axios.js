import axios from "axios"

const baseUrlTest = "http://localhost:3001/"
const baseUrlLocalNetwork = "http://192.168.1.199:3001/"

const instance = axios.create({
    baseURL: baseUrlTest,
})

export default instance