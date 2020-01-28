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

export function isBooleanFacet(facetConfig: FacetConfigBase): facetConfig is BooleanFacetConfig {
	return facetConfig.datatype === EsDataType.Boolean
}

export function isDateFacet(facetConfig: FacetConfigBase): facetConfig is DateFacetConfig {
	return facetConfig.datatype === EsDataType.Date
}

export function isListFacet(facetConfig: FacetConfigBase): facetConfig is ListFacetConfig {
	return facetConfig.datatype === EsDataType.Keyword
}

export function isRangeFacet(facetConfig: FacetConfigBase): facetConfig is RangeFacetConfig {
	return facetConfig.datatype === EsDataType.Integer
}
