import axios from "axios";
const Base_URL=import.meta.env.MODE==="development"?"http://localhost:3000/api":"/api";
export const api= axios.create({
    baseURL: Base_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

