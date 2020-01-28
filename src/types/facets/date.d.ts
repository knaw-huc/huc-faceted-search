interface DateFacetConfig extends FacetConfigBase {
	readonly datatype: EsDataType.Date
}

interface DateFacetData extends DateFacetConfig {
	filters: RangeFacetFilter,
	interval?: 'year' | 'month' | 'day'
} 

interface DateFacetProps {
	facetData: DateFacetData
	facetsDataDispatch: React.Dispatch<FacetsDataReducerAction>
	values: RangeFacetValues
}
