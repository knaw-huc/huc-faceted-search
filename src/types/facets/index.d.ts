/// <reference path="./boolean.d.ts" />
/// <reference path="./list.d.ts" />
/// <reference path="./range.d.ts" />

interface FacetConfig {
	readonly datatype?: EsDataType
	readonly id: string
	readonly order?: number
	readonly title?: string
}

type FacetValues = ListFacetValues | BooleanFacetValues | RangeFacetValues

type FacetData = ListFacetData | BooleanFacetData | RangeFacetData
type FacetsData = Map<string, FacetData>

interface FacetProps {
	id: string
	title: string
}
