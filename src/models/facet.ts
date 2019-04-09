export abstract class BaseFacet {
	id: string

	constructor(public field: string, public index: number, public type: FacetType) {
		this.id = `${field}_${index}`
	}

	abstract reset(): void 
}

export class ListFacet extends BaseFacet {
	filters: Set<string>
	order: [SortBy, SortDirection]
	query: string
	total: number
	type = FacetType.List
	values: ListFacetValue[]
	viewSize: number

	constructor(field: string, index: number, public settings: ListSettings) {
		super(field, index, FacetType.List)
		this.reset()
	}

	reset() {
		this.filters = new Set()
		this.order = [SortBy.Count, SortDirection.Desc]
		this.query = ''
		this.total = 0
		this.values = []
		this.viewSize = this.settings.size
	}

	viewLess() {
		if (this.viewSize > this.settings.size) this.viewSize -= this.settings.size
	}

	viewMore() {
		this.viewSize += this.settings.size
	}
}

export class BooleanFacet extends BaseFacet {
	filters: Set<string>
	type = FacetType.Boolean
	values: ListFacetValue[]

	constructor(field: string, index: number, public settings: BooleanSettings) {
		super(field, index, FacetType.Boolean)
		this.reset()
	}

	reset() {
		this.filters = new Set()
		this.values = []
	}
}


export class RangeFacet extends BaseFacet {
	filter: [number, number]
	histogramValues: any[]
	type: FacetType.Range
	values: [number, number]

	constructor(field: string, index: number, public settings: RangeSettings) {
		super(field, index, FacetType.Range)
		this.reset()
	}

	reset() {
		this.filter = null
		this.histogramValues = []
		this.values = [null, null]
	}
}
