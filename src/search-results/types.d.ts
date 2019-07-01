interface Hit {
	facsimiles?: { id: string, path: string}[]
	id: string
	snippets: string[]
	[key: string]: any
}
interface SearchResults {
	hits: Hit[]
	id?: string
	query?: Object
	total: number
}

interface ResultBodyProps {
	result: Hit
}
