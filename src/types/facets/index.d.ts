/// <reference path="./boolean.d.ts" />
/// <reference path="./date.d.ts" />
/// <reference path="./list.d.ts" />
/// <reference path="./range.d.ts" />

interface FacetConfigBase {
	readonly datatype?: EsDataType
	readonly id: string
	readonly order?: number
	title?: string
}

interface OtherFacetConfig extends FacetConfigBase {
	readonly datatype?: EsDataType.Geo_point | EsDataType.Null | EsDataType.Text
}

type FacetConfig = BooleanFacetConfig | DateFacetConfig | ListFacetConfig | RangeFacetConfig | OtherFacetConfig
type FacetValues = ListFacetValues | BooleanFacetValues | RangeFacetValues

type FacetData = ListFacetData | BooleanFacetData | RangeFacetData | DateFacetData
type FacetsData = Map<string, FacetData>

interface FacetProps {
	id: string
	title: string
}
