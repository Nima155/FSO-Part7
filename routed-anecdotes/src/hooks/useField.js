import { useState } from "react"
export function useField(type) {
	const [value, setValue] = useState("")

	const onChange = ({ target }) => {
		setValue(target.value)
	}
	const reset = () => {
		setValue("")
	}

	return {
		type,
		onChange,
		value,
		reset,
	}
}
