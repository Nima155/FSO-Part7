import React from "react"
import Blog from "./Blog"
import { render } from "@testing-library/react"
import "@testing-library/jest-dom"
import { simulateClick } from "../utils/test_helpers"
// likes: 5,
// url: "ggg.com",
// author: "Tim Dickenson",
// title: "Tim loves books",
// user: {
// username: "nima13424",
// id: "60e04eb6e92a70256cad37a1"
// },
describe("<Blog /> tests", () => {
	let component, mockFunction
	beforeEach(() => {
		mockFunction = jest.fn()
		// render a component, without rendering to the DOM
		component = render(
			<Blog
				blog={{
					likes: 10,
					author: "Arthur Morgan",
					title: "Fools",
					user: { username: "nima155" },
					url: "ggg.com",
				}}
				onLike={mockFunction}
			/>
		)
	})

	test("likes is not there by default", () => {
		// container contains all the rendered HTML
		const minorHTML = component.container.querySelector(".defaultParagraph")
		expect(component.container.querySelector(".likes")).toBeNull()
		expect(minorHTML).not.toBeNull()
		// author is there
		expect(minorHTML).toHaveTextContent("Arthur Morgan")
		// title is there
		expect(minorHTML).toHaveTextContent("Fools")
	})

	test("likes and url are visible when the show button is clicked", () => {
		simulateClick("view", component, 1)

		expect(component.container.querySelector(".likes")).toHaveTextContent("10")
		expect(component.container).toHaveTextContent("ggg.com")
	})

	test("The like button calls its handler as many times as it's clicked", () => {
		simulateClick("view", component, 1)
		simulateClick("Like", component, 2)
		expect(mockFunction.mock.calls).toHaveLength(2)
	})
})
