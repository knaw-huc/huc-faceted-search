abstract class BaseFacet {
	id: string

	constructor(public field: string, public index: number, public type: FacetType) {
		this.id = `${field}_${index}`
	}
}

export class ListFacet extends BaseFacet {
	filters: Set<string> = new Set()
	order: [SortBy, SortDirection] = [SortBy.Count, SortDirection.Desc]
	query: string = ''
	total: number = 0
	type = FacetType.List
	values: ListFacetValue[] = []
	viewSize: number

	constructor(field: string, index: number, public settings: ListSettings) {
		super(field, index, FacetType.List)
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
	filters: Set<string> = new Set()
	type = FacetType.Boolean
	values: ListFacetValue[] = []

	constructor(field: string, index: number, public settings: BooleanSettings) {
		super(field, index, FacetType.Boolean)
	}
}


export class RangeFacet extends BaseFacet {
	filter: [number, number]
	histogramValues: any[] = []
	type: FacetType.Range
	values: [number, number] = [null, null]

	constructor(field: string, index: number, public settings: RangeSettings) {
		super(field, index, FacetType.Range)
	}
}