/* 
allows us to forgo handling potential errors with try-catch 
as it does all the handling by itself
*/
require("express-async-errors")
require("dotenv").config()

/* 
a router is a middleware for grouping related routes in one place
*/
const blogRouter = require("express").Router()
// blog model
const Blog = require("../models/blog")

const middleware = require("../utils/middleware")

blogRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 })

	response.json(blogs)
})
/* 
removed (next) from signature as 
it's not needed due to express-async-erros
*/
blogRouter.post("/", middleware.userExtractor, async (request, response) => {
	const body = request.body

	const blog = new Blog({
		url: body.url,
		author: body.author,
		likes: body.likes,
		title: body.title,
		user: request.user.id,
	})
	let result = await blog.save()
	// populate the newly created blog with the user data
	result = await Blog.populate(result, {
		path: "user",
		select: { username: 1, name: 1 },
	})

	request.user.blogs = request.user.blogs.concat(result.id)
	// also update the user entry
	await request.user.save()

	response.status(201).json(result)
})
// delete logic with route specific middleware
blogRouter.delete(
	"/:id",
	middleware.userExtractor,
	async (request, response) => {
		const dataToDelete = await Blog.findOne({ _id: request.params.id })

		/* 													why is this a string? */
		if (dataToDelete.user.toString() === request.user.id) {
			// functional programming.. not mutating the original array
			const copyOfBlogs = request.user.blogs.concat()
			// remove the removed blog from the user blogs list as well
			copyOfBlogs.splice(copyOfBlogs.indexOf(dataToDelete), 1)
			request.user.blogs = copyOfBlogs
			// actually remove from the database
			await request.user.save()
			await dataToDelete.remove()
			response.status(204).end()
			return
		}

		response.status(401).json({ error: "unauthorized or missing token" })
	}
)

blogRouter.put("/:id", middleware.userExtractor, async (request, response) => {
	const body = request.body

	const updatedBlog = {
		likes: body.likes,
		author: body.author,
		title: body.title,
		url: body.url,
	}

	responseData = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, {
		// to return the updated document
		new: true,
	})

	// we must end all responses.. .json() does this automatically
	response.status(200).json(responseData)
})

module.exports = blogRouter
// let responseData
// const allLikes = await Blog.findOne({ _id: request.params.id })

// if (allLikes.likedBy.indexOf(request.user.id) === -1) {
// 	responseData = await Blog.findByIdAndUpdate(
// 		request.params.id,
// 		{ $inc: { likes: 1 }, $push: { likedBy: request.user.id } },
// 		{
// 			// to return the updated document
// 			new: true,
// 		}
// 	)
// } else {
// 	responseData = await Blog.findByIdAndUpdate(
// 		request.params.id,
// 		{ $inc: { likes: -1 }, $pull: { likedBy: { $in: [request.user.id] } } },
// 		{
// 			// to return the updated document
// 			new: true,
// 		}
// 	)
// }
