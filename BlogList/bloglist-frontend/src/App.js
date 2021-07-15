import React, { useState, useEffect, useRef } from "react"
import Blog from "./components/Blog"
import blogService from "./services/blogs"
import { LoginForm } from "./components/LoginForm"
import { CreateBlogForm } from "./components/CreateBlogForm"
import loginService from "./services/login"
import Notification from "./components/Notification"
import Togglable from "./components/Togglable"
const App = () => {
	const [blogs, setBlogs] = useState([])
	const [user, setUser] = useState(null)
	const togglableRef = useRef()
	const [notificationMessage, setNotificationMessage] = useState("")
	const [theme, setTheme] = useState("")

	// again for testing purposes
	if (blogs.some((ele) => !ele.user))
		setBlogs((blogs) => blogs.filter((ele) => ele.user))

	function messageSetter(msg, color) {
		setNotificationMessage(msg)
		setTheme(color)
		setTimeout(() => {
			setNotificationMessage("")
			setTheme("")
		}, 5000)
	}

	async function createBlog({ url, author, title }) {
		try {
			// hide the create blog form on creation by utilizing refs and forward refs and ....
			togglableRef.current.toggleVisibility()
			const response = await blogService.createBlog({
				url,
				author,
				title,
			})

			setBlogs(blogs.concat(response))
			messageSetter(`A new blog: ${title} by ${author} added`, "green")
		} catch (error) {
			messageSetter(error.message, "red")
		}
	}

	async function userLogin({ username, password }) {
		try {
			const response = await loginService(username, password)
			// stringify json response and store in the local storage
			blogService.setToken(response.token)
			window.localStorage.setItem("blogUser", JSON.stringify(response))
			// save the response as state
			setUser(response)
		} catch (error) {
			messageSetter("wrong username or password", "red")
		}
	}
	// logout logic
	function clickHandler() {
		window.localStorage.removeItem("blogUser")
		setUser("")
	}
	// fetch and sort
	function resorter() {
		blogService
			.getAll()
			.then((blogs) =>
				setBlogs(blogs.concat().sort((a, b) => b.likes - a.likes))
			)
			.catch((err) => {
				console.log(err.message)
			})
	}

	// fetching all blogs from the database.. this will get called on every login and logout
	useEffect(() => {
		// fetch sorted blog
		resorter()
	}, [user])
	// code for keeping a user logged in, even after a page refresh
	useEffect(() => {
		// check local storage
		const userStringifiedJSON = window.localStorage.getItem("blogUser")

		if (userStringifiedJSON) {
			const currentUser = JSON.parse(userStringifiedJSON)
			// check validity of the token...

			if (Date.now() - currentUser.stampedDate < 3600000) {
				setUser(currentUser)
				blogService.setToken(currentUser.token)
			} else {
				window.localStorage.removeItem("blogUser")
			}
		}
	}, [])

	return (
		<div>
			{user ? (
				<>
					<h2>blogs</h2>
					<Notification theme={theme} message={notificationMessage} />
					<p>
						{user.username} logged in{" "}
						<button onClick={clickHandler}>Logout</button>
					</p>
					{/* togglable is a reusable component */}
					<Togglable buttonDialogue={"create new blog"} ref={togglableRef}>
						<CreateBlogForm formSubmission={createBlog} />
					</Togglable>
					{blogs.map((blog) => (
						<Blog
							key={blog.id}
							blog={blog}
							resorter={resorter}
							username={user.username}
						/>
					))}
				</>
			) : (
				<>
					<h2>log in to application</h2>
					<Notification theme={theme} message={notificationMessage} />
					<LoginForm onFormSubmission={userLogin} />
				</>
			)}
		</div>
	)
}

export default App
