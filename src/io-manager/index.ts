import backends, { Backend } from './backends'
import FacetManager from '../facets-manager'

export default class IOManager {
	private backend: Backend

	// Cache fetches. If the request is already fetched, no need to fetch it
	// again. The request is stored as-is, so also if only the `from` prop differs,
	// it still is a seperate entry in the cache
	private cache: {[key: string]: string} = {}

	// Cache of hits by request. The `from` prop from the request is removed,
	// because although the `from` value is different, it belongs to the same
	// request. The hitsCache combines the hits, which enables a lookup for
	// prev/next result
	private hitsCache: { [key: string]: Hit[] } = {}

	// Store the last request so it can be reused when changing the 'cursor'.
	// In case of ES this means changing the `from` prop
	private lastRequest: any

	// Store the current page. Initially stored here because there are 2 pagination
	// views, which could also be stored in their shared parent, but because of
	// this.goToPage and this.hitsCache, this is a more logical place
	currentPage: number = 1

	onChange: OnIOManagerChange

	constructor(private options: Options, private facetsManager: FacetManager) {
		this.backend = backends[options.backend]
		this.facetsManager.onChange = async () => {
			const requestBody = new this.backend.RequestCreator(this.facetsManager, this.options.resultsPerPage)
			const response = await this.handleFetch(requestBody)
			this.onChange(response)
		}
	}

	// TODO type request
	private async handleFetch(request: any): Promise<OnChangeResponse> {
		let response: any
		const body = JSON.stringify(request)
		if (this.cache.hasOwnProperty(body)) {
			response = JSON.parse(this.cache[body])
		} else {
			this.lastRequest = request
			const fetchResponse = await this.fetch(body)
			const responseParser = new this.backend.ResponseParser(fetchResponse, this.facetsManager)
			response = responseParser.parsedResponse
			this.cache[body] = JSON.stringify(response)
			this.updateHitsCache(request, response.hits)
		}

		return {
			request,
			response,
			query: this.facetsManager.query
		}
	}

	private updateHitsCache(request: any, hits: Hit[]) {
		let { from, ...rest } = request
		const hitsKey = JSON.stringify(rest)
		if (from == null) from = 0
		const arr = this.hitsCache[hitsKey] || []
		hits.forEach((hit: Hit, index: number) => {
			arr[from + index] = hit
		})
		this.hitsCache[hitsKey] = arr
	}

	private async fetch(body: string) {
		let fetchResponse: Response
		let response: any

		try {
			fetchResponse = await fetch(this.options.url, {
				method: 'post',
				headers: { 'Content-Type': 'application/json' },
				body
			})	
			response = await fetchResponse.json()
		} catch (err) {
			throw('Failed to fetched Faceted Search state')
		}
		
		return fetchResponse.status === 200 ? response : null
	}

	goToPage = async (pageNumber: number) => {
		if (this.lastRequest == null) return

		this.currentPage = pageNumber

		const body = this.lastRequest
		body.from = body.size * (pageNumber - 1)

		const response = await this.handleFetch(body)

		this.onChange(response)
	}

	getPrevNext(id: string): [Hit, Hit] {
		if (this.lastRequest == null) return

		const { from, ...rest } = this.lastRequest
		const hits = this.hitsCache[JSON.stringify(rest)]
		const index = hits.findIndex(hit => hit.id === id)
		console.log(index)
		return [hits[index - 1], hits[index + 1]]
	}

	// TODO the `from` and `size` props might be too ES specific?
	// async getNext() {
	// 	if (!this.history.length) return
	// 	const lastItem = this.history[this.history.length - 1]
	// 	const body = JSON.parse(lastItem.request)
	// 	if (body.hasOwnProperty('from')) body.from += body.size
	// 	else body.from = body.size

	// 	const response = await this.handleFetch(body)
	// 	response.response.hits = lastItem.response.hits.concat(response.response.hits)

	// 	this.onChange(response)
	// }
}
