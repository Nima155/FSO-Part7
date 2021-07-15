import axios from "axios"
const baseUrl = "/api/blogs"
let TOKEN = null
let authorizationObj = null
const setToken = (token) => {
	TOKEN = `bearer ${token}`
	// set proper authorization header
	authorizationObj = {
		headers: { Authorization: TOKEN },
	}
}

const createBlog = async (blogInfo) => {
	// post a new blog
	return (await axios.post(baseUrl, blogInfo, authorizationObj)).data
}
const likeBlog = async (blogInfo) => {
	return (
		await axios.put(`${baseUrl}/${blogInfo.id}`, blogInfo, authorizationObj)
	).data
}

const deleteBlog = async (blogId) => {
	await axios.delete(`${baseUrl}/${blogId}`, authorizationObj)
}

const getAll = () => {
	const request = axios.get(baseUrl)
	return request.then((response) => response.data)
}

export default { getAll, setToken, createBlog, likeBlog, deleteBlog }
