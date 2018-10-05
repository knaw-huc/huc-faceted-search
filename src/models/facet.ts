export enum FacetType {
	List,
	Range,
}

export enum SortBy {
	Count = '_count',
	Key = '_term',
}

export enum SortDirection {
	Asc = 'asc',
	Desc = 'desc',
}

export class Facet {
	id: string

	constructor(public field: string, public index: number, public type: FacetType) {
		this.id = `${field}_${index}`
	}
}

export interface ListFacetValue {
	key: string
	doc_count: number
}

export class ListFacet extends Facet {
	filters: Set<string> = new Set()
	order: [SortBy, SortDirection] = [SortBy.Count, SortDirection.Desc]
	query: string = null
	values: ListFacetValue[] = []
	viewSize: number

	constructor(field: string, index: number, public size: number) {
		super(field, index, FacetType.List)

		this.viewSize = size
	}

	viewLess() {
		if (this.viewSize > this.size) this.viewSize -= this.size
	}

	viewMore() {
		this.viewSize += this.size
	}
}

export class RangeFacet extends Facet {
	filter: [number, number]
	histogramValues: any[] = []
	values: [number, number] = [null, null]

	constructor(field: string, index: number) {
		super(field, index, FacetType.Range)
	}
}

export type Facets = { [id: string]: ListFacet | RangeFacet }