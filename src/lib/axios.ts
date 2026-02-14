import axios from "axios";

export const JUPYTER_BASE_URL = "http://localhost:8000";
export const JUPYTER_USER = "admin";
export const JUPYTER_TOKEN = process.env.NEXT_PUBLIC_JUPYTER_TOKEN!;

export const jupyterAxios = axios.create({
  baseURL: `${JUPYTER_BASE_URL}/user/${JUPYTER_USER}/api`,
  headers: {
    Authorization: `token ${JUPYTER_TOKEN}`,
    "Content-Type": "application/json",
  },
});
