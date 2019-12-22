export const SPOT_COLOR = '#08c'
export const BACKGROUND_GRAY = '#f6f6f6'

export async function fetchSearchResults(url: string, request: any) {
	let fetchResponse: Response
	let response: any

	try {
		fetchResponse = await fetch(url, {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(request)
		})	
		response = await fetchResponse.json()
	} catch (err) {
		throw('Failed to fetched Faceted Search state')
	}
	
	return fetchResponse.status === 200 ? response : null
}

export function isBooleanFacet(facetConfig: FacetConfig): facetConfig is BooleanFacetConfig {
	return facetConfig.datatype === EsDataType.Boolean
}

export function isListFacet(facetConfig: FacetConfig): facetConfig is ListFacetConfig {
	return facetConfig.datatype === EsDataType.Keyword
}

export function isRangeFacet(facetConfig: FacetConfig): facetConfig is RangeFacetConfig {
	return facetConfig.datatype === EsDataType.Date
}
