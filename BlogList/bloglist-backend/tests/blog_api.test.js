// to be able to close the connection
const mongoose = require("mongoose")
// to be able to perform tests with http requests
const supertest = require("supertest")
// to put inside supertest for testing purposes
const app = require("../app")
// to be able to send the correct requests
const Blog = require("../models/blog")
// creates superagent object ready for testing
const api = supertest(app)
// helper functions for tests
const helper = require("./blog_api_helper")
// to be able to test user auths and ....
const User = require("../models/users")

const bcrypt = require("bcrypt")
/* 
note the structure of the test cases and 
how we're grouping the related cases 
*/
describe("blog api tests", () => {
	let token = ""
	const newBlog = {
		title: "henchmen of newYork",
		author: "peter parker",

		url: "http://2223.de",
	}
	const missingBlog = {
		author: "peter molyneaux",
		likes: 10,
	}
	beforeEach(async () => {
		await Blog.deleteMany({})
		await User.deleteMany({})
		const password = "damndaniel"
		const userModelInstance = new User({
			username: "nima155",
			passwordHash: await bcrypt.hash(password, 10),
			name: "nima",
		})
		const user = await userModelInstance.save()

		await api
			.post("/api/login")
			.send({ username: user.username, password: password })
			.expect((res) => {
				token = res.body.token
			})
		await api
			.post("/api/blogs")
			.send(helper.listOFBlogs[0])
			.auth(token, { type: "bearer" })
	})

	describe("when there are notes in the database", () => {
		test("api returns correct number of blogs", async () => {
			const allBlogs = await helper.blogsInDB()

			const response = await api.get("/api/blogs") // => same as api/blogs/ in this case

			expect(response.body).toHaveLength(allBlogs.length)
		})
		test("id is the unique identifier of all blogs", async () => {
			const allBlogs = await api.get("/api/blogs")
			// don't forget to access the body property of the response
			allBlogs.body.forEach((ele) => {
				// testing for the existence of id and the non existence of _id
				expect(ele.id).toBeDefined()
				expect(ele._id).not.toBeDefined()
			})
		})
	})
	describe("addition of a new note", () => {
		test("posting blogs works", async () => {
			const allBlogsBefore = await helper.blogsInDB()
			const result = await api
				.post("/api/blogs")
				.auth(token, { type: "bearer" })
				.send(newBlog)
				.expect(201)
				.expect("Content-Type", /application\/json/)

			expect(result.body).toHaveProperty("url")
			expect(result.body).toHaveProperty("likes")
			expect(result.body).toHaveProperty("title")
			expect(result.body).toHaveProperty("author")
			expect(result.body).toHaveProperty("id")

			const allBlogs = await helper.blogsInDB()
			// check to see if there is now 1 more blog in the database
			expect(allBlogs).toHaveLength(allBlogsBefore.length + 1)
		})

		test("posting with no likes set will set likes as 0", async () => {
			const result = await api
				.post("/api/blogs")
				.auth(token, { type: "bearer" })
				.send(newBlog)
				.expect(201)
				.expect("Content-Type", /application\/json/)

			expect(result.body.likes).toBe(0)
		})
		test("posting without url and title should result in 400 badRequest", async () => {
			await api
				.post("/api/blogs")
				.auth(token, { type: "bearer" })
				.send(missingBlog)
				.expect(400)
		})
		test("Posting without a token fails with a 401", async () => {
			await api.post("/api/blogs").send(missingBlog).expect(401)
		})
	})
	describe("updating and or deleting entries", () => {
		test("deleting an entry with a given id that exists", async () => {
			const allBlogs = await helper.blogsInDB()

			const id = allBlogs[0].id,
				user = allBlogs[0].user
			const userBlogIndex = (await User.findOne({ _id: user })).blogs.indexOf(
				id
			)
			expect(userBlogIndex).not.toBe(-1)
			await api
				.delete(`/api/blogs/${id}`)
				.auth(token, { type: "bearer" })
				.expect(204)
			const userBlogsAfter = await User.findOne({ _id: user })
			const allBlogsAfter = await helper.blogsInDB()
			expect(userBlogsAfter.blogs.indexOf(id)).toBe(-1)
			expect(allBlogsAfter.indexOf(allBlogs[0])).toBe(-1)
		})
		test("updating an entry with a given id that exists", async () => {
			const allBlogs = await helper.blogsInDB()
			await api
				.put(`/api/blogs/${allBlogs[0].id}`)
				.auth(token, { type: "bearer" })
				.send({ likes: 22220 })
				.expect(200)
		})
	})
})
// user api tests
describe("user api tests", () => {
	beforeEach(async () => {
		await User.deleteMany({})
		await Blog.deleteMany({})
	})
	test("invalid post request is not accepted", async () => {
		await api
			.post("/api/users")
			.send({ username: "nima123", invalidInput: "lorem" })
			.expect(400)
	})

	test("can create a valid user", async () => {
		const users = await User.find({})

		await api
			.post("/api/users")
			.send({ username: "nima12345", password: "bigEars1234142123#$@#%#5" })
			.expect(200)
			.expect("Content-Type", /application\/json/)

		// check whether user is really now there
		const usersAfter = await api.get("/api/users")

		expect(usersAfter.body).toHaveLength(users.length + 1)
	})

	test("Short usernames are not accepted", async () => {
		await api
			.post("/api/users")
			.send({ username: "ni", passowrd: "231541sdaf" })
			.expect(400)
	})
})
afterAll(() => {
	mongoose.connection.close()
})
