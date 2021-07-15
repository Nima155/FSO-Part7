import React from "react"
import PropTypes from "prop-types"

import { forwardRef, useImperativeHandle, useState } from "react"
// using forward ref allows the component to access the ref that it's been assigned to
const Togglable = forwardRef((props, ref) => {
	const [visibility, setVisibility] = useState(false)

	function toggleVisibility() {
		setVisibility(!visibility)
	}

	// this allows the parent component to have access to the function returned
	useImperativeHandle(ref, () => {
		// must return an object.. otherwise won't work
		return { toggleVisibility }
	})
	const showWhenHide = { display: !visibility ? "" : "none" }
	const showWhenVisible = { display: visibility ? "" : "none" }

	return (
		<>
			<div style={showWhenHide}>
				<button onClick={() => toggleVisibility()}>
					{props.buttonDialogue}
				</button>
			</div>

			<div style={showWhenVisible}>
				{props.children}
				<button onClick={() => toggleVisibility()}>Cancel</button>
			</div>
		</>
	)
})
// setting displayName as required by EsLint
Togglable.displayName = "Togglable"
// propType constraint
Togglable.propTypes = {
	buttonDialogue: PropTypes.string.isRequired,
}
export default Togglable
