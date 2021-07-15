import axios from "axios"

const BASE_URL = "/api/login"

const login = async (username, password) => {
	const res = await axios.post(BASE_URL, { username, password })
	return res.data
}
export default login
