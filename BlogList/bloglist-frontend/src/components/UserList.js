import React from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

export default function UserList() {
	const userList = useSelector((state) => state.userList)

	return (
		<div>
			<h2>Users</h2>
			<table>
				<thead>
					<tr>
						<th></th>
						<th>Blogs created</th>
					</tr>
				</thead>
				<tbody>
					{userList.map((ele) => (
						<tr key={ele.id}>
							<td>
								<Link to={`/users/${ele.id}`}>{ele.username}</Link>
							</td>
							<td>{ele.blogs.length}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
