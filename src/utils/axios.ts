import axios from "axios";

const backendBaseURL = process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_SERVER_PROD
    : process.env.NEXT_PUBLIC_SERVE_DEV;

export default axios.create({
  withCredentials: true,
  baseURL: backendBaseURL,
});