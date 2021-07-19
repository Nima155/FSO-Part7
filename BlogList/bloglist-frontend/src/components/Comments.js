import React from "react"
import { nanoid } from "nanoid"
import { useDispatch } from "react-redux"
import { addCommentAction } from "../reducers/blogListReducer"
export default function Comments({ comments, id }) {
	const dispatch = useDispatch()
	const submitHanlder = async (event) => {
		event.preventDefault()
		try {
			await dispatch(addCommentAction(id, event.target.comment.value))
		} catch (err) {
			// TODO: notification
		}
	}
	return (
		<div>
			<h3>Comments</h3>
			<form onSubmit={submitHanlder}>
				<input type="text" name="comment" />
				<button>Add comment</button>
			</form>
			<ul>
				{comments.map((ele) => (
					<li key={`id ${nanoid()}`}>{ele}</li>
				))}
			</ul>
		</div>
	)
}
