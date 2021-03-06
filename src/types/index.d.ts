/// <reference path="../reducers/facets-data.d.ts" />
/// <reference path="./facets/index.d.ts" />

interface AppProps {
	autoSuggest?: (query: string) => Promise<string[]>
	className?: string /* className prop is used by StyledComponents */
	disableDefaultStyle?: boolean
	excludeResultFields?: string[]
	fields: FacetConfig[]
	onClickResult: (result: any, ev: React.MouseEvent<HTMLLIElement>) => void
	resultFields?: string[]
	ResultBodyComponent: React.FC<ResultBodyProps>
	resultBodyProps?: Record<string, any>
	resultsPerPage?: number
	track_total_hits?: number
	url: string
}

type Filters = Map<string, Set<string>>

type SortOrder = Map<string, SortDirection>
type SetSortOrder = (sortOrder: SortOrder) => void

type ElasticSearchRequestOptions = Pick<AppProps, 'excludeResultFields' | 'resultFields' | 'resultsPerPage'> & {
	currentPage: number
	facetsData: FacetsData
	query: string
	sortOrder: SortOrder
	track_total_hits: number
}

interface KeyCount {
	key: string,
	count: number
}

interface RangeKeyCount {
	key: number,
	count: number
	// from: number
	// to: number
}

interface FSResponse {
	results: Hit[]
	total: number
}

interface ParsedResponse {
	aggregations: { [id: string]: any}
	hits: any[]
	total: number
}

// ENUMS
declare const enum EsDataType {
	Boolean = "boolean",
	Completion = "completion",
	Date = "date",
	Geo_point = "geo_point",
	Hierarchy = "hierarchy",
	Integer = "integer",
	Keyword = "keyword",
	Null = "null",
	Text = "text",
}

// declare const enum FacetType {
// 	Boolean = 'boolean',
// 	List = 'list',
// 	Range = 'range',
// }

declare const enum SortBy {
	Count = '_count',
	Key = '_term',
}

declare const enum SortDirection {
	Asc = 'asc',
	Desc = 'desc',
}

// interface Backend {
// 	RequestCreator: any
// 	// responseParser: (response: any, facets: Facet[]) => FSResponse
// 	responseParser: any
// }

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

interface ActiveFilter {
	id: string
	title: string
	values: string[]
}
