import * as React from 'react'
import { isListFacet, isBooleanFacet, isRangeFacet, isDateFacet } from '../../../../constants'
import ActiveFilter from './active-filter'

function hasFilter(facetData: FacetData) {
	if (facetData.filters == null) return false

	if (isListFacet(facetData) || isBooleanFacet(facetData)) {
		return facetData.filters.size > 0
	}
	else if (isRangeFacet(facetData) || isDateFacet(facetData)) {
		return facetData.filters.hasOwnProperty('from') && facetData.filters.from != null
	}

	return false
}

function getFilterValue(facetData: FacetData): string[] {
	if (!hasFilter(facetData)) return []

	if (isListFacet(facetData) || isBooleanFacet(facetData)) {
		return Array.from(facetData.filters)
	}
	else if (isRangeFacet(facetData) || isDateFacet(facetData)) {
		return [`${facetData.filters.from} - ${facetData.filters.to}`]
	}

	return []
}

function useFilters(facetsData: FacetsData) {
	const [filters, setFilters] = React.useState<ActiveFilter[]>([])
	React.useEffect(() => {
		const activeFilters: ActiveFilter[] = []

		for (const facetData of facetsData.values()) {
			const values = getFilterValue(facetData)

			if (values.length) {
				activeFilters.push({
					id: facetData.id,
					title: facetData.title,
					values,
				})
			}
		}

		setFilters(activeFilters)
	}, [facetsData])
	return filters
}

interface Props {
	dispatch: React.Dispatch<FacetsDataReducerAction>
	facetsData: FacetsData
}
function ActiveFilters(props: Props) {
	const filters = useFilters(props.facetsData)
	console.log(filters)
	return (
		<div>
			<ul>
				{
					filters.map(filter =>
						<ActiveFilter
							dispatch={props.dispatch}
							filter={filter}
							key={filter.id}
						/>
					)
				}
			</ul>
		</div>
	)
}

export default React.memo(ActiveFilters)
