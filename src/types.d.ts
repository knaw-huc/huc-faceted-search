/// <reference path="./reducers/facets-data.d.ts" />

interface AppProps {
	autoSuggest?: (query: string) => Promise<string[]>
	backend?: BackendType
	className?: string
	disableDefaultStyle?: boolean
	fields: FacetConfig[]
	onChange?: (response: OnChangeResponse) => void
	onClickResult: (result: any, ev: React.MouseEvent<HTMLLIElement>) => void
	resultFields?: string[]
	getResultBodyComponent: () => Promise<React.SFC<ResultBodyProps>>
	resultBodyProps?: Record<string, any>
	resultsPerPage?: number
	url: string
}

interface FacetConfig {
	readonly datatype?: EsDataType
	readonly id: string
	readonly order?: number
	readonly size?: number
	readonly title?: string
}

type FacetData = FacetConfig & {
	filters: Set<string>
	query: string
	sort: {
		by: SortBy,
		direction: SortDirection
	}
	viewSize: number
} 
type FacetsData = Map<string, FacetData>

type Filters = Map<string, Set<string>>
type Sorts = Map<string, { by: SortBy, direction: SortDirection }>

type Facet = import('./models/facet').BooleanFacet | import('./models/facet').ListFacet | import('./models/facet').RangeFacet
type Facets = Map<string, Facet>
type BackendType = 'none' | 'elasticsearch'
type OnFacetManagerChange = () => void
type OnIOManagerChange = (response: IOManagerOnChangeResponse) =>  void
interface IOManagerOnChangeResponse {
	request: any,
	response: FSResponse
}

interface ElasticSearchRequestOptions {
	facetsData: FacetsData
	resultFields: AppProps['resultFields']
	query: string
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
type RangeFacetValues = { key: number, count: number }[]
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

interface IOOptions extends Pick<AppProps, 'backend' | 'resultFields' | 'resultsPerPage' | 'url'> {
	onChange: OnIOManagerChange
}

// interface IOHistory {
// 	request: any,
// 	response: ParsedResponse,
// }

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
declare const enum EsDataType {
	Boolean = "boolean",
	Date = "date",
	Geo_point = "geo_point",
	Integer = "integer",
	Keyword = "keyword",
	Null = "null",
	Text = "text",
}

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
	id: string
	title: string
}

// BOOLEAN
interface BooleanSettings {
	labels?: {
		true: string,
		false: string
	}
}
type BooleanFacetProps = FacetProps & BooleanSettings & {
	addFilter: (field: string, value: string) => void
	filters: Set<string>
	removeFilter: (field: string, value: string) => void
	values: BooleanFacetValues
}

// LIST
interface ListSettings {
	size?: number
}
type ListFacetProps = {
	addFacetQuery: (value: string) => void
	addFilter: (value: string) => void
	facetData: FacetData
	removeFilter: (value: string) => void
	sortListFacet: (by: SortBy, direction: SortDirection) => void
	values: ListFacetValues
	viewLess: () => void
	viewMore: () => void
}

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
	// lowerLimit: number
	rangeMin: number,
	rangeMax: number,
	// upperLimit: number
}

interface Backend {
	RequestCreator: any
	// responseParser: (response: any, facets: Facet[]) => FSResponse
	responseParser: any
}

interface Hit {
	// facsimiles?: { id: string, path: string[] }[]
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
