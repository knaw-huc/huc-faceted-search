interface BooleanFacetConfig extends FacetConfig {
	readonly datatype: EsDataType.Boolean
	readonly labels?: { false: string, true: string }
}

type BooleanFacetData = BooleanFacetConfig & {
	filters: Set<string>
} 

interface BooleanFacetValues {
	true: number
	false: number
}

interface BooleanFacetProps {
	facetData: BooleanFacetData
	facetsDataDispatch: React.Dispatch<FacetsDataReducerAction>
	values: BooleanFacetValues
}
