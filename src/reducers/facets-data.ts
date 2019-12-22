function initBooleanFacet(booleanFacetConfig: BooleanFacetConfig): BooleanFacetData {
	return {
		...booleanFacetConfig,
		filters: new Set(),
		labels: booleanFacetConfig.labels || { true: 'Yes', false: 'No' }
	}
}

function initListFacet(listFacetConfig: ListFacetConfig): ListFacetData {
	return {
		...listFacetConfig,
		datatype: EsDataType.Keyword, /* Explicitlyl set the datatype, for it is the default; facetConfig's without a datatype are converted to ListFacet's */
		filters: new Set(),
		sort: null,
		query: '',
		size: listFacetConfig.size || 10,
		viewSize: listFacetConfig.size || 10,
	}
}

function initRangeFacet(rangeFacetConfig: RangeFacetConfig): RangeFacetData {
	return {
		...rangeFacetConfig,
		filters: new Set(),
		type: rangeFacetConfig.type || 'timestamp'
	}
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

export function facetsDataReducerInit(fields: AppProps['fields']): FacetsData {
	return fields
		.reduce((prev, curr) => {
			if		(isListFacet(curr))		prev.set(curr.id, initListFacet(curr))
			else if (isBooleanFacet(curr))	prev.set(curr.id, initBooleanFacet(curr))
			else if (isRangeFacet(curr))	prev.set(curr.id, initRangeFacet(curr))
			else							prev.set(curr.id, initListFacet(curr as ListFacetConfig))

			return prev
		}, new Map())
}

export default function facetsDataReducer(facetsData: FacetsData, action: FacetsDataReducerAction) {
	if (action.type === 'clear') {
		return facetsDataReducerInit(action.fields)
	}

	const facet = facetsData.get(action.facetId)

	if (isListFacet(facet) || isBooleanFacet(facet)) {
		switch(action.type) {
			case 'add_filter': {
				facet.filters = new Set(facet.filters.add(action.value))
				return new Map(facetsData)
			}

			case 'remove_filter': {
				facet.filters.delete(action.value)
				facet.filters = new Set(facet.filters)
				return new Map(facetsData)
			}
		}
	}

	if (isListFacet(facet)) {
		switch(action.type) {
			case 'set_query': {
				facet.query = action.value
				return new Map(facetsData)
			}

			case 'set_sort': {
				facet.sort = { by: action.by,  direction: action.direction }
				return new Map(facetsData)
			}

			case 'view_less': {
				if (facet.viewSize > facet.size) {
					facet.viewSize -= facet.size
					if (facet.viewSize < facet.size) facet.viewSize = facet.size
					return new Map(facetsData)
				}
				break
			}

			case 'view_more': {
				if (action.total - facet.viewSize > 0) {
					facet.viewSize += facet.size
					return new Map(facetsData)
				}
				break
			}
		}
	}


	return facetsData
}
