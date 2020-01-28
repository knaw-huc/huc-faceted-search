import { isListFacet, isBooleanFacet, isRangeFacet, isDateFacet } from '../constants'
import React from 'react'

function initBooleanFacet(booleanFacetConfig: BooleanFacetConfig): BooleanFacetData {
	return {
		...booleanFacetConfig,
		filters: new Set(),
		labels: booleanFacetConfig.labels || { true: 'Yes', false: 'No' }
	}
}

function initDateFacet(rangeFacetConfig: DateFacetConfig): DateFacetData {
	return {
		...rangeFacetConfig,
		filters: null,
		interval: null,
	}
}

function initListFacet(listFacetConfig: ListFacetConfig): ListFacetData {
	return {
		...listFacetConfig,
		datatype: EsDataType.Keyword, /* Explicitly set the datatype, for it is the default; facetConfig's without a datatype are converted to ListFacet's */
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
		filters: null,
		max: null,
		min: null,
	}
}

export function initFacetsData(fields: AppProps['fields']) {
	return fields
		.reduce((prev, curr) => {
			if		(isListFacet(curr))		prev.set(curr.id, initListFacet(curr))
			else if (isBooleanFacet(curr))	prev.set(curr.id, initBooleanFacet(curr))
			else if (isRangeFacet(curr))	prev.set(curr.id, initRangeFacet(curr))
			else if (isDateFacet(curr))		prev.set(curr.id, initDateFacet(curr))
			// else							prev.set(curr.id, initListFacet(curr as ListFacetConfig))

			return prev
		}, new Map())
}

export default function useFacetsDataReducer(fields: AppProps['fields']) {
	const x = React.useReducer(facetsDataReducer, initFacetsData(fields))

	React.useEffect(() => {
		x[1]({ type: 'clear', fields })
	}, [fields])

	return x
}

function facetsDataReducer(facetsData: FacetsData, action: FacetsDataReducerAction): FacetsData {
	if (action.type === 'clear') {
		return initFacetsData(action.fields)
	}

	const facet = facetsData.get(action.facetId)
	console.log(facet, action)

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

	if (isRangeFacet(facet)) {
		switch(action.type) {
			case 'set_range': {
				const { type, ...filter } = action
				facet.filters = filter
				return new Map(facetsData)
			}

			case 'remove_filter': {
				// const { type, ...filter } = action
				facet.filters = null
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
