interface ListFacetConfig extends FacetConfig {
	readonly datatype: EsDataType.Keyword
	readonly size?: number
}

type ListFacetData = ListFacetConfig & {
	filters: Set<string>
	query: string
	sort: {
		by: SortBy,
		direction: SortDirection
	}
	viewSize: number
} 

interface ListFacetValues {
	total: number
	values: KeyCount[]
}

interface ListFacetProps {
	facetData: ListFacetData
	facetsDataDispatch: React.Dispatch<FacetsDataReducerAction>
	values: ListFacetValues
}
