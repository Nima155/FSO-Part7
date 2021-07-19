import React from "react"
import { useDispatch, useSelector } from "react-redux"

import { likeBlogAction, deleteBlogAction } from "../reducers/blogListReducer"
import Comments from "./Comments"

const Blog = ({ blog, username, onLike = null }) => {
	if (!blog) {
		return null
	}
	const dispatch = useDispatch()

	const { likes } = useSelector(({ blogs }) => {
		return blogs.blogs.filter((ele) => ele.id === blog.id)[0]
	})

	// just for test purposes
	if (!onLike) {
		onLike = async () => {
			try {
				await dispatch(likeBlogAction(blog)) // like logic
				// TODO: might need to resort blogs
			} catch (err) {
				// TODO: maybe use notification
			}
		}
	}
	// removing a blog
	function removeHandler() {
		if (window.confirm(`remove blog ${blog.title}! by ${blog.author}?`)) {
			// await blogServices.deleteBlog(blog.id)
			dispatch(deleteBlogAction(blog.id))
		}
	}
	// const [displayMode, setDisplayMode] = useState(false)
	// TODO: could maybe use togglable here?
	return (
		<div datacy={"blogStructure"}>
			<h2>
				{blog.title} {blog.author}
			</h2>
			<a href={blog.url}>{blog.url}</a>
			{/* class just used for testing purposes */}
			<p className="likes">
				likes: {likes} <button onClick={onLike}>Like</button>
			</p>
			<p>{`added by ${blog.user.username}`}</p>
			{/* remove option available only if blog created by current logged in user */}
			{blog.user.username === username && (
				<button onClick={removeHandler}>remove</button>
			)}
			<Comments comments={blog.comments} id={blog.id} />
		</div>
	)
}

export default Blog
