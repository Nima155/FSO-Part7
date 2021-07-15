import React from "react"
import { render, fireEvent } from "@testing-library/react"
import { CreateBlogForm } from "./CreateBlogForm"
import { simulateClick } from "../utils/test_helpers"
describe("<CreateBlogForm /> tests", () => {
	let mockFunction
	const URL = "gigiHadid.com"
	const AUTHOR = "Peter Clemens"
	const TITLE = "The Master"
	beforeEach(() => {
		mockFunction = jest.fn()
	})

	test("The mock function is called with the right arguments on blog submission", () => {
		const component = render(<CreateBlogForm formSubmission={mockFunction} />)
		// get all related input elements
		const authorInput = component.container.querySelector("#author")
		const urlInput = component.container.querySelector("#url")
		const titleInput = component.container.querySelector("#title")
		// simulate form input values
		fireEvent.change(authorInput, { target: { value: AUTHOR } })
		fireEvent.change(urlInput, { target: { value: URL } })
		fireEvent.change(titleInput, { target: { value: TITLE } })

		simulateClick("create", component, 1)
		// mock function is called with the right values
		expect(mockFunction.mock.calls[0][0].url).toBe(URL)
		expect(mockFunction.mock.calls[0][0].author).toBe(AUTHOR)
		expect(mockFunction.mock.calls[0][0].title).toBe(TITLE)
	})
})
