import React from "react"
const Notification = ({ message, theme }) => {
	if (!message) {
		return null
	}
	return (
		<div
			style={{
				padding: "0.2rem",
				border: `5px solid ${theme}`,
				color: `${theme}`,
				backgroundColor: "lightgray",
				margin: "5px 0px",
				borderRadius: "5px",
			}}
		>
			<p>{message}</p>
		</div>
	)
}
export default Notification
