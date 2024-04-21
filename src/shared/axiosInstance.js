import axios from "axios";


export const axiosInstance = axios.create({
    baseURL: `https://dligjs37pj7q2.cloudfront.net/api/admin`,
    headers: { "Content-Type": "application/json" },
});