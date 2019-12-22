interface RangeFacetConfig extends FacetConfig {
	readonly datatype: EsDataType.Date
	readonly type?: 'number' | 'timestamp'
}

type RangeFacetData = RangeFacetConfig & {
	filters: Set<string>
	interval?: 'year' | 'month' | 'day'
} 

interface RangeFacetProps {
	facetData: RangeFacetData
	values: RangeFacetValues
}

interface RangeState {
	rangeMin: number,
	rangeMax: number,
}

type RangeFacetValues = { key: number, count: number }[]
