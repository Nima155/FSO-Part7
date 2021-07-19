import { getAll } from "../services/users"
export default function userListReducer(state = [], action) {
	switch (action.type) {
		case "ALL_USERS":
			return action.payload.users
	}
	return state
}

export const userListFetchAction = () => async (dispatch) => {
	const response = await getAll()
	dispatch({ type: "ALL_USERS", payload: { users: response } })
}
