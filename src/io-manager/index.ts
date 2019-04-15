import backends, { Backend } from './backends'
import FacetManager from '../facets-manager'

export default class IOManager {
	private backend: Backend
	private cache: {[key: string]: string} = {}
	private history: IOHistory[] = []
	onChange: OnIOManagerChange

	constructor(private options: Options, private facetsManager: FacetManager) {
		this.backend = backends[options.backend]
		this.facetsManager.onChange = this.dispatch
	}

	dispatch = async () => {
		const requestBody = new this.backend.RequestCreator(this.facetsManager, this.options.resultsPerPage)
		const response = await this.handleFetch(requestBody)
		this.onChange(response)
	}

	// TODO type request
	private async handleFetch(request: any): Promise<OnChangeResponse> {
		const body = JSON.stringify(request)
		let response: any
		if (this.cache.hasOwnProperty(body)) {
			response = JSON.parse(this.cache[body])
		} else {
			// TODO type response
			response = await this.fetch(body)
			this.cache[body] = JSON.stringify(response)
		}

		const responseParser = new this.backend.ResponseParser(response, this.facetsManager)

		this.history.push({ request: body, response: responseParser.parsedResponse })

		return {
			request,
			response: responseParser.parsedResponse,
			query: this.facetsManager.query
		}
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

	// TODO the `from` and `size` props might be too ES specific?
	async getNext() {
		if (!this.history.length) return
		const lastItem = this.history[this.history.length - 1]
		const body = JSON.parse(lastItem.request)
		if (body.hasOwnProperty('from')) body.from += body.size
		else body.from = body.size

		const response = await this.handleFetch(body)
		response.response.hits = lastItem.response.hits.concat(response.response.hits)

		this.onChange(response)
	}

	goToPage = async (pageNumber: number) => {
		if (!this.history.length) return
		const lastItem = this.history[this.history.length - 1]
		const body = JSON.parse(lastItem.request)
		body.from = body.size * (pageNumber - 1)

		const response = await this.handleFetch(body)

		this.onChange(response)
	}
}
