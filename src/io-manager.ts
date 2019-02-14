import { Facets } from './models/facet';
import backends, { Backend } from './backends'

type DispatchResponse = { response: any, facets: Facets }

interface Options {
	backend: 'none' | 'elasticsearch'
	url: string
}
export default class IOManager {
	private backend: Backend
	private cache: {[key: string]: string} = {}
	requestBody: any

	constructor(private options: Options) {
		this.backend = backends[options.backend]
	}

	async dispatch(facets: Facets, query: string): Promise<DispatchResponse> {
		this.requestBody = new this.backend.RequestCreator(facets, query)
		const body = JSON.stringify(this.requestBody)

		let response: any
		if (this.cache.hasOwnProperty(body)) {
			response = JSON.parse(this.cache[body])
		} else {
			response = await this.fetch(body)
			this.cache[body] = JSON.stringify(response)
		}

		const responseParser = new this.backend.ResponseParser(response, facets)

		return {
			facets: responseParser.facets,
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
}
