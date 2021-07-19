import React, { useState } from "react"
import { Grid, TextField, Button } from "@material-ui/core"
import Notification from "./Notification"

const LoginForm = ({ onFormSubmission }) => {
	// this is not bad practice because username and password are not needed by the parent component, so they can be states here.
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	async function onFormSubmit(e) {
		// prevent page refresh
		console.log("hi")
		e.preventDefault()
		await onFormSubmission({ username, password })
	}

	return (
		<Grid
			container
			justifyContent="center"
			alignItems="center"
			direction="column"
			style={{ height: "100vh" }}
		>
			<form
				onSubmit={onFormSubmit}
				style={{ display: "flex", flexDirection: "column" }}
			>
				<TextField
					required
					id="username"
					variant="outlined"
					type="text"
					label="username"
					value={username}
					onChange={({ target }) => setUsername(target.value)}
				/>
				<br />
				<TextField
					required
					id="password"
					variant="outlined"
					type="password"
					label="password"
					value={password}
					onChange={({ target }) => setPassword(target.value)}
				/>

				<br />
				<Button variant="contained" color="primary" type="submit">
					Login
				</Button>
			</form>
			<Grid item>
				<Notification />
			</Grid>
		</Grid>
	)
}

export { LoginForm }
