type Facet = import('./models/facet').BooleanFacet | import('./models/facet').ListFacet | import('./models/facet').RangeFacet
type Facets = Map<string, Facet>
type BackendType = 'none' | 'elasticsearch'
type OnFacetManagerChange = () => void
type OnIOManagerChange = (response: OnChangeResponse) =>  void
type OnChangeResponse = { request: any, response: any, query: string }


interface Options {
	backend: BackendType
	resultsPerPage: number
	url: string
}

interface IOHistory {
	request: string,
	response: ParsedResponse,
}

interface ParsedResponse {
	aggregations: { [id: string]: any}
	hits: any[]
	total: number
}

interface ElasticSearchResponse {
	aggregations: { [id: string]: any}
	hits: {
		hits: { _source: any }[]
		total: number
	}
}


// ENUMS
declare const enum FacetType {
	Boolean = 'boolean',
	List = 'list',
	Range = 'range',
}

declare const enum SortBy {
	Count = '_count',
	Key = '_term',
}

declare const enum SortDirection {
	Asc = 'asc',
	Desc = 'desc',
}

// FACET 
interface FacetProps {
	field: string
	title: string
}

// BOOLEAN
interface BooleanSettings {
	labels?: [string, string]
}
type BooleanFacetProps = FacetProps & BooleanSettings

// LIST
interface ListSettings {
	size?: number
}
type ListFacetProps = FacetProps & ListSettings

interface ListFacetState {
	collapsed: boolean
	options: boolean
}

interface ListFacetValue {
	key: string
	doc_count: number
}

// RANGE
interface RangeSettings {
	interval?: 'year' | 'month' | 'day'
	type?: 'number' | 'timestamp'
}
type RangeProps = FacetProps & RangeSettings

interface RangeState {
	lowerLimit: number
	rangeMin: number,
	rangeMax: number,
	upperLimit: number
}
