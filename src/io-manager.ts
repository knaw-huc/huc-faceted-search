import backends, { Backend } from './backends'
import { ParsedResponse } from './backends/elasticsearch/response-parser'
import FacetsManager from './facets-manager';

type DispatchResponse = { request: any, response: any }

interface History {
	// facets: Facets,
	// query: string,
	request: string,
	response: ParsedResponse,
}

interface Options {
	backend: 'none' | 'elasticsearch'
	url: string
}
export default class IOManager {
	private backend: Backend
	private cache: {[key: string]: string} = {}
	private history: History[] = []

	constructor(private options: Options, private facetsManager: FacetsManager) {
		this.backend = backends[options.backend]
	}

	async dispatch(): Promise<DispatchResponse> {
		const requestBody = new this.backend.RequestCreator(this.facetsManager)
		return this.handleFetch(requestBody)
	}

	// TODO type request
	async handleFetch(request: any) {
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
			response: responseParser.parsedResponse
		}
	}

	private async fetch(body: any) {
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

		const dispatchResponse = await this.handleFetch(body)
		dispatchResponse.response.hits = lastItem.response.hits.concat(dispatchResponse.response.hits)

		return {
			...dispatchResponse,
			query: this.facetsManager.query,
		}
	}
}
