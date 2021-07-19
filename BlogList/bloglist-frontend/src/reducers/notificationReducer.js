function notificationReducer(state = {}, action) {
	switch (action.type) {
		case "SET_NOTIFICATION":
			return { message: action.payload.content, theme: action.payload.color }
		case "CLEAR_NOTIFICATION":
			return {}
		default:
			return state
	}
}

let timeHandle

export const setNotificationAction = (content, color) => async (dispatch) => {
	dispatch({ type: "SET_NOTIFICATION", payload: { content, color } })

	clearTimeout(timeHandle)

	timeHandle = setTimeout(() => {
		dispatch({ type: "CLEAR_NOTIFICATION" })
	}, 10000)
}
export const setClearNotificationAction = () => {
	return {
		type: "CLEAR_NOTIFICATION",
	}
}

export default notificationReducer
