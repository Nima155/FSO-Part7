import { createStore, applyMiddleware, combineReducers } from "redux"
import thunk from "redux-thunk"
import blogs from "./reducers/blogListReducer"
import { composeWithDevTools } from "redux-devtools-extension"
import notification from "./reducers/notificationReducer"
import user from "./reducers/userReducer"
import userList from "./reducers/userListReducer"
const store = createStore(
	combineReducers({
		notification,
		blogs,
		user,
		userList,
	}), // combining all the different reducers into one
	composeWithDevTools(applyMiddleware(thunk)) // applying redux thunk (so that we can use async action creators)
	// and enabling debugging with the dev tools
)

export default store
