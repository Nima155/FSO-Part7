import React from "react"

export default function User({ user }) {
	return user ? (
		<div>
			<h2>{user.username}</h2>
			<h3>{"blogs"}</h3>
			<ul>
				{user.blogs.map((ele) => (
					<li key={ele.id}>{ele.title}</li>
				))}
			</ul>
		</div>
	) : (
		<></>
	)
}
