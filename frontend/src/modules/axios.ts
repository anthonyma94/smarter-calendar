import axios from "axios";

const BASE_URL = "/api";

const http = axios.create({
    withCredentials: true,
    baseURL: BASE_URL,
    xsrfCookieName: "_csrf",
});

export default http;
