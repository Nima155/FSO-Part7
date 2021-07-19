import { useRouteMatch } from "react-router-dom"
export default function useIdToResource(key, ...paths) {
	// key is the name of params
	if (!paths.length) {
		return null
	}

	const [path, list] = paths.shift()
	const match = useRouteMatch(path)

	const matchIfAny = match
		? list.find((ele) => ele[key] === match.params[key])
		: null

	return [matchIfAny].concat(useIdToResource(key, ...paths))
}
