import blogService from "../services/blogs"

const initialState = { blogs: [], theme: "" }
function blogListReducer(state = initialState, action) {
	switch (action.type) {
		case "ADD_COMMENT":
			return {
				...state,
				blogs: state.blogs.map((ele) =>
					ele.id === action.payload.id
						? { ...ele, comments: ele.comments.concat(action.payload.comment) }
						: ele
				),
			}
		case "SET_BLOG_FILTER":
			return {
				...state,
				blogs: action.payload.response,
			}
		case "REMOVE_BLOG":
			return {
				...state,
				blogs: state.blogs.filter((ele) => ele.id !== action.payload.id),
			}
		case "SET_BLOG":
			return { ...state, blogs: state.blogs.concat(action.payload.blog) }

		case "LIKE_BLOG":
			return {
				...state,
				blogs: state.blogs.map((ele) =>
					ele.id === action.payload.id ? { ...ele, likes: ele.likes + 1 } : ele
				),
			}
		default:
			return state
	}
}

export function setBlogAction(blog) {
	// creating and or filtering action creator for blogs
	return async (dispatch) => {
		if (blog.length === 0) {
			const response = await blogService.getAll()
			dispatch({
				type: "SET_BLOG_FILTER",
				payload: {
					response: response.map((ele) => {
						return { ...ele, show: false }
					}),
				},
			})
			return
		}
		const response = await blogService.createBlog(blog)

		dispatch({
			type: "SET_BLOG",
			payload: { blog: { ...response, show: false } },
		})
	}
}
export function addCommentAction(id, comment) {
	// console.log(id, comment)
	return async (dispatch) => {
		await blogService.postComment(id, comment)
		dispatch({ type: "ADD_COMMENT", payload: { id, comment } })
	}
}
export function deleteBlogAction(id) {
	return async (dispatch) => {
		await blogService.deleteBlog(id)
		dispatch({ type: "REMOVE_BLOG", payload: { id } })
	}
}
export function likeBlogAction(blog) {
	return async (dispatch) => {
		await blogService.likeBlog({
			...blog,
			likes: blog.likes + 1,
		})
		dispatch({
			type: "LIKE_BLOG",
			payload: { id: blog.id },
		})
	}
}

export default blogListReducer
