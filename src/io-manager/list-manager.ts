import { AggregationRequest, FacetType, IFacet, Response } from "./index"
import { IFacetValue } from "../list-facet/value"

export enum SortBy {
	Count = '_count',
	Key = '_term',
}

export enum SortDirection {
	Asc = 'asc',
	Desc = 'desc',
}

export interface IListFacet extends IFacet {
	size: number
	values: IFacetValue[]
}
export default class ListManager {
	aggregations: { [key: string]: AggregationRequest } = {}
	facets: { [key: string]: IListFacet } = {}
	filters: any[] = []

	addFacet(id: string, field: string, size: number) {
		this.addFacetData(id, field, size)
		this.addAggregation(id, field, size)
	}

	addFilter(field: string, key: string) {
		this.filters.push({ term: { [field]: key } })
	}

	removeFilter(field: string, key: string) {
		this.filters = this.filters.filter(filter => 
			!filter.term.hasOwnProperty(field) &&
			filter.term[field] !== key
		)
	}

	reset() {
		this.filters = []
		Object.keys(this.facets).map(id => {
			const facet = this.facets[id]
			this.addAggregation(id, facet.field, facet.size)
		})
	}

	addQuery(id: string, field: string, query: string) {
		const { terms } = this.aggregations[id].aggs[field]
		if (!query || !query.length) delete terms.include
		terms.include = `.*${query}.*`
	}

	sortBy(id: string, field: string, sortBy: SortBy, direction: SortDirection) {
		const { terms } = this.aggregations[id].aggs[field]
		terms.order = {
			[sortBy]: direction
		}
		console.log(terms.order)
	}

	updateFacets(response: Response) {
		for (const facetId of Object.keys(this.facets)) {
			const facet = this.facets[facetId]
			if (!response.aggregations.hasOwnProperty(facetId)) continue
			let { buckets } = response.aggregations[facetId][facet.field] as { buckets: IFacetValue[] }
			facet.values = Array.isArray(buckets) ? buckets : []
		}
	}

	private addAggregation(id: string, field: string, size: number): void {
		this.aggregations[id] = {
			aggs: {
				[field]: {
					terms: {
						field: field,
						size: size
					}
				},
				[`${field}-count`]: {
					cardinality: {
						field: field
					}
				}
			},
			filter: {
				match_all: {}
			}
		}
	}

	private addFacetData(id: string, field: string, size: number): void {
		this.facets[id] = {
			field,
			size,
			type: FacetType.List,
			values: []
		}
	}
}