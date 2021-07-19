import loginService from "../services/login"
import blogService from "../services/blogs"

export default function userReducer(state = {}, action) {
	switch (action.type) {
		case "LOGOUT":
			return {}
		case "LOGIN":
		case "LOGGED_IN":
			return { user: action.payload.user }
	}
	return state
}

export function setUserLogoutAction() {
	return {
		type: "LOGOUT",
	}
}
export function setUserThereAction(user) {
	return {
		type: "LOGGED_IN",
		payload: { user },
	}
}
export function setUserLoginAction(username, password) {
	return async (dispatch) => {
		// if (username instanceof Object) {
		// 	// incase we have a token and username is actually the user instance saved in local storage
		// 	dispatch({ type: "SET_USER", payload: { user: username } })
		// 	return
		// }
		const response = await loginService(username, password)
		// stringify json response and store in the local storage

		blogService.setToken(response.token)
		window.localStorage.setItem("blogUser", JSON.stringify(response))

		dispatch({ type: "LOGIN", payload: { user: response } })
	}
}
