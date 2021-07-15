require("dotenv").config()
const logger = require("./logger")
const User = require("../models/users")
const jwt = require("jsonwebtoken")
const unknownEndPoint = (request, response) => {
	response.status(404).json({ error: "Page does not exist" })
}

const tokenExtractor = (request, response, next) => {
	// get authorization header.. which is where our token string is
	const authorization = request.get("authorization")

	if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
		request.token = authorization.substring(7)
	} else request.token = null

	next()
}
const userExtractor = async (request, response, next) => {
	const tokenObject =
		request.token && jwt.verify(request.token, process.env.SECRET)
	if (!request.token || !tokenObject.id) {
		response.status(401).json({ error: "invalid or missing token" })
	}
	request.user = await User.findOne({ _id: tokenObject.id })
	next()
}

const errorHandler = (error, request, response, next) => {
	if (error.name === "ValidationError") {
		// TODO: maybe improve the error message
		response.status(400).json({ message: error._message })
	}
	// invalid token => unauthorized
	if (error.name === "JsonWebTokenError") {
		response.status(401).json({ message: "invalid token" })
	}
	next(error)
}
module.exports = {
	unknownEndPoint,
	errorHandler,
	tokenExtractor,
	userExtractor,
}
