// loadash library
const _ = require("lodash")

const dummy = (blogs) => 1

const totalLikes = (blogs) => {
	return blogs.reduce((prev, cur) => prev + cur.likes, 0)
}
const favoriteBlog = (blogs) => {
	if (!blogs.length) return null
	const maximumLikes = Math.max(...blogs.map((ele) => ele.likes))
	return blogs.find((ele) => ele.likes == maximumLikes)
}
const mostBlogs = (blogs) => {
	// loadash function countBy
	const results = _.countBy(blogs, "author")

	let author = "",
		maxim = 0

	for (let key in results) {
		if (results[key] > maxim) {
			ans = key
			maxim = results[key]
		}
	}
	return {
		author: ans,
		blogs: maxim,
	}
}

const mostLikes = (blogs) => {
	// loadash function groupBy
	const results = _.groupBy(blogs, "author")

	let ans = "",
		maxim = 0

	for (let value in results) {
		let sum = results[value].reduce((prev, cur) => prev + cur.likes, 0)
		if (sum > maxim) {
			ans = value
			maxim = sum
		}
	}
	return {
		author: ans,
		likes: maxim,
	}
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes,
}
