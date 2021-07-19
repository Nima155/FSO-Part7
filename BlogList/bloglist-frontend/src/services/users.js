import axios from "axios"
const BASE_URL = "/api/users"
export function getAll() {
	return axios.get(BASE_URL).then((res) => res.data)
}
