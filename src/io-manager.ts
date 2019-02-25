import { Facets } from './models/facet';
import backends, { Backend } from './backends'
import { ParsedResponse } from './backends/elasticsearch/response-parser';

type DispatchResponse = { request: any, response: any, facets: Facets }

interface History {
	facets: Facets,
	query: string,
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

	constructor(private options: Options) {
		this.backend = backends[options.backend]
	}

	async dispatch(facets: Facets, query: string): Promise<DispatchResponse> {
		const requestBody = new this.backend.RequestCreator(facets, query)
		// const body = JSON.stringify(requestBody)
		return this.handleFetch(requestBody, facets, query)
	}

	async handleFetch(request: any, facets: Facets, query: string) {
		const body = JSON.stringify(request)
		let response: any
		if (this.cache.hasOwnProperty(body)) {
			response = JSON.parse(this.cache[body])
		} else {
			response = await this.fetch(body)
			this.cache[body] = JSON.stringify(response)
		}

		const responseParser = new this.backend.ResponseParser(response, facets)

		this.history.push({ facets, query, request: body, response: responseParser.parsedResponse })

		return {
			facets: responseParser.facets,
			request,
			response: responseParser.parsedResponse
		}
	}

	async fetch(body: any) {
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

		const dispatchResponse = await this.handleFetch(body, lastItem.facets, lastItem.query)
		dispatchResponse.response.hits = lastItem.response.hits.concat(dispatchResponse.response.hits)

		return {
			...dispatchResponse,
			query: lastItem.query,
		}
	}
}
