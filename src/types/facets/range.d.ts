interface RangeFacetFilter {
	from: number
	to?: number
}

type RangeFacetValues = RangeKeyCount[]


interface RangeFacetConfig extends FacetConfigBase {
	readonly datatype: EsDataType.Integer
	readonly interval: number,
}

interface RangeFacetData extends RangeFacetConfig {
	filters: RangeFacetFilter,
	min: number,
	max: number
} 

interface RangeFacetProps {
	facetData: RangeFacetData
	facetsDataDispatch: React.Dispatch<FacetsDataReducerAction>
	values: RangeFacetValues
}
