type Facet = import('./models/facet').BooleanFacet | import('./models/facet').ListFacet | import('./models/facet').RangeFacet
type Facets = Map<string, Facet>
type BackendType = 'none' | 'elasticsearch'
type OnFacetManagerChange = () => void
type OnIOManagerChange = (response: IOManagerOnChangeResponse) =>  void
interface IOManagerOnChangeResponse {
	request: any,
	response: FSResponse
}
interface OnChangeResponse extends IOManagerOnChangeResponse {
	query: string
}

interface KeyCount {
	key: string,
	count: number
}
interface ListFacetValues {
	total: number
	values: KeyCount[]
}
type RangeFacetValues = [number, number]
interface BooleanFacetValues {
	true: number
	false: number
}
type FacetValues = ListFacetValues | BooleanFacetValues | RangeFacetValues
interface FSResponse {
	facetValues: Record<string, FacetValues>
	results: Hit[]
	total: number
}

interface Options {
	backend: BackendType
	onChange: OnIOManagerChange
	resultsPerPage: number
	url: string
}

interface IOHistory {
	request: any,
	response: ParsedResponse,
}

interface ParsedResponse {
	aggregations: { [id: string]: any}
	hits: any[]
	total: number
}

// interface ElasticSearchResponse {
// 	aggregations: { [id: string]: any}
// 	hits: {
// 		hits: { _source: any }[]
// 		total: number
// 	}
// }

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
	labels?: {
		true: string,
		false: string
	}
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

// interface ListFacetValue {
// 	key: string
// 	doc_count: number
// }

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

interface Backend {
	RequestCreator: any
	responseParser: (response: any, facets: Facet[]) => FSResponse
}

interface Hit {
	facsimiles?: { id: string, path: string[] }[]
	id: string
	snippets: string[]
	[key: string]: any
}

interface SearchResults {
	hits: Hit[]
	id?: string
	query?: Object
	total: number
}

interface ResultBodyProps {
	result: Hit
}
