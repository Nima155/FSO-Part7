import { useState } from "react"
import React from "react"
const CreateBlogForm = ({ formSubmission }) => {
	const [url, setUrl] = useState("")
	const [author, setAuthor] = useState("")
	const [title, setTitle] = useState("")

	function onFormSubmit(event) {
		event.preventDefault()
		formSubmission({ url, author, title })
		setUrl("")
		setAuthor("")
		setTitle("")
	}

	return (
		<form onSubmit={onFormSubmit}>
			<label>
				title:
				<input
					id="title"
					value={title}
					onChange={({ target }) => setTitle(target.value)}
				/>
			</label>
			<br />
			<label>
				author:
				<input
					id="author"
					value={author}
					onChange={({ target }) => setAuthor(target.value)}
				/>
			</label>
			<br />
			<label>
				url:
				<input
					id="url"
					value={url}
					onChange={({ target }) => setUrl(target.value)}
				/>
			</label>
			<br />
			<button id="createButton">create</button>
		</form>
	)
}
export { CreateBlogForm }
