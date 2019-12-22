interface RangeFacetConfig extends FacetConfig {
	readonly datatype: EsDataType.Date
	readonly type?: 'number' | 'timestamp'
}

interface RangeFacetFilter {
	from: number
	to?: number
}

type RangeFacetData = RangeFacetConfig & {
	filter: RangeFacetFilter,
	interval?: 'year' | 'month' | 'day'
} 

interface RangeFacetProps {
	facetData: RangeFacetData
	facetsDataDispatch: React.Dispatch<FacetsDataReducerAction>
	values: RangeFacetValues
}

interface RangeState {
	rangeMin: number,
	rangeMax: number,
}

type RangeFacetValues = { key: number, count: number }[]
