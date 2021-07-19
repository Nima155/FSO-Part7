import React, { useEffect, useRef, useState } from "react"
import Blog from "./components/Blog"
import blogService from "./services/blogs"
import {
	setUserLoginAction,
	setUserLogoutAction,
	setUserThereAction,
} from "./reducers/userReducer"
import UserList from "./components/UserList"
import { LoginForm } from "./components/LoginForm"
import { CreateBlogForm } from "./components/CreateBlogForm"
import { Link, Route, Switch } from "react-router-dom"
import Notification from "./components/Notification"
import Togglable from "./components/Togglable"
import { useDispatch, useSelector } from "react-redux"
import { setBlogAction } from "./reducers/blogListReducer"
import { setNotificationAction } from "./reducers/notificationReducer"
import User from "./components/User"
import { userListFetchAction } from "./reducers/userListReducer"
import useIdToResource from "./hooks/useIdToResource"
import {
	AppBar,
	Typography,
	Button,
	Toolbar,
	Tabs,
	Tab,
	Grid,
} from "@material-ui/core"
const App = () => {
	const dispatch = useDispatch()
	const [tabIndex, setTabIndex] = useState(0)
	const togglableRef = useRef()

	const [{ blogs }, { user }, userList] = useSelector((state) => [
		state.blogs,
		state.user,
		state.userList,
	]) // accessing the state of the redux store

	// again for testing purposes
	if (blogs.some((ele) => !ele.user)) dispatch(setBlogAction(""))

	const [userMatched, blogMatched] = useIdToResource(
		"id",
		["/users/:id", userList],
		["/blogs/:id", blogs]
	)

	async function createBlog(blog) {
		try {
			// hide the create blog form on creation by utilizing refs and forward refs and ....
			togglableRef.current.toggleVisibility()

			await dispatch(setBlogAction(blog))
			dispatch(
				setNotificationAction(
					`A new blog: ${blog.title} by ${blog.author} added`,
					"green"
				)
			)
		} catch (error) {
			dispatch(setNotificationAction(error.message, "red"))
		}
	}

	async function userLogin({ username, password }) {
		try {
			await dispatch(setUserLoginAction(username, password))
		} catch (error) {
			dispatch(setNotificationAction("wrong username or password", "red"))
		}
	}
	// logout logic
	function clickHandler() {
		window.localStorage.removeItem("blogUser")
		dispatch(setUserLogoutAction())
	}

	// fetching all blogs from the database.. this will get called on every login and logout
	useEffect(() => {
		// fetch sorted blog
		// resorter()
		dispatch(userListFetchAction())
		dispatch(setBlogAction(""))
	}, [])
	// code for keeping a user logged in, even after a page refresh
	useEffect(() => {
		// check local storage
		const userStringifiedJSON = window.localStorage.getItem("blogUser")
		if (userStringifiedJSON) {
			const currentUser = JSON.parse(userStringifiedJSON)
			// check validity of the token...

			if (Date.now() - currentUser.stampedDate < 3600000) {
				dispatch(setUserThereAction(currentUser))
				blogService.setToken(currentUser.token)
			} else {
				window.localStorage.removeItem("blogUser")
			}
		}
	}, [])
	const onTabChange = (event, newValue) => {
		setTabIndex(newValue)
	}
	return (
		<>
			{user ? (
				<div>
					<AppBar position="static">
						<Toolbar>
							<Tabs
								style={{ flexGrow: 1 }}
								value={tabIndex}
								onChange={onTabChange}
							>
								<Tab component={Link} label="Home" to="/" />
								<Tab component={Link} label="Users" to="/users" />
							</Tabs>
							<Typography
								style={{ marginRight: 5 }}
							>{`${user.username}`}</Typography>
							<Button onClick={clickHandler} color="inherit" size="small">
								Logout
							</Button>
						</Toolbar>
					</AppBar>

					<Notification />

					<Switch>
						<Route path="/blogs/:id">
							<Blog blog={blogMatched} username={user.username} />
						</Route>
						<Route path="/users/:id">
							<User user={userMatched} />
						</Route>
						<Route path="/users">
							<UserList />
						</Route>
						<Route path="/">
							<Grid container direction="column">
								<Typography variant="h4">Blog app</Typography>
								{/* togglable is a reusable component */}
								<Togglable
									buttonDialogue={"create new blog"}
									ref={togglableRef}
								>
									<CreateBlogForm formSubmission={createBlog} />
								</Togglable>
								{blogs
									.map((blog) => (
										<div
											key={blog.id}
											style={{
												padding: 10,
												border: "solid",
												marginBottom: 3,
											}}
										>
											<Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
										</div>
									))
									.sort((a, b) => b.likes - a.likes)}
							</Grid>
						</Route>
					</Switch>
				</div>
			) : (
				<div>
					<LoginForm onFormSubmission={userLogin} />
				</div>
			)}
		</>
	)
}

export default App
