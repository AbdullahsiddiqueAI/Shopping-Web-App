import axios from "axios";
export const API_URL = "http://127.0.0.1:8000/api/";

const instance = axios.create({
  baseURL: API_URL,
  timeout: 15 * 1000,
});

instance.interceptors.request.use(async (request) => {
  const accessToken = localStorage.getItem("access");
  if (accessToken) {
    request.headers.authorization = `Bearer ${accessToken}`;
  }
  return request;
});



export default instance;
