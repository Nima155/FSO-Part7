import { fireEvent } from "@testing-library/react"

export function simulateClick(buttonText, component, numberOfClicks) {
	// get button
	const button = component.getByText(buttonText)
	// simulate clicks
	for (let i = 0; i < numberOfClicks; i++) {
		fireEvent.click(button)
	}
}
