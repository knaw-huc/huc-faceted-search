import { AggregationRequest, FacetType, IFacet, Response } from "./index"

export interface IRangeFacet extends IFacet {
	histogramValues: any[]
	values: [number, number]
}
interface IRangeFilter {
	range: {
		[key: string]: {
			gte: number,
			lte: number,
		}
	}
}
export default class RangeManger {
	aggregations: { [key: string]: AggregationRequest } = {}
	facets: { [key: string]: IRangeFacet } = {}
	filters: IRangeFilter[] = []

	addFacet(id: string, field: string) {
		this.addFacetData(id, field)
		this.addAggregation(id, field)
		this.addHistogramAggregation(`${id}_histogram`)
	}

	addFilter(field: string, min: number, max: number) {
		this.removeFilter(field)
		this.filters
			.push({
				range: {
					[field]: {
						gte: min,
						lte: max
					}
				}
			})
	}

	reset() {
		this.filters = []
		this.aggregations = {}
	}

	updateFacets(response: Response) {
		for (const facetId of Object.keys(this.facets)) {
			const facet = this.facets[facetId]
			if (!response.aggregations.hasOwnProperty(facetId)) continue
			const { min, max } = response.aggregations[facetId][facetId]
			facet.values = [min, max]
			facet.histogramValues = response.aggregations[`${facetId}_histogram`].buckets
		}
	}

	private addAggregation(id: string, field: string): void {
		this.aggregations[id] = {
			aggs: {
				[id]: {
					stats: {
						field: field,
					}
				},
			},
			filter: {
				match_all: {}
			}
		}
	}

	// FIXME field: "date" should be a variable
	private addHistogramAggregation(id: string): void {
		this.aggregations[id] = {
			date_histogram: {
				field: "date",
				interval: "year",
			}
		} as any
	}

	private addFacetData(id: string, field: string): void {
		this.facets[id] = {
			field,
			histogramValues: [],
			type: FacetType.Range,
			values: [null, null]
		}
	}

	private removeFilter(field: string) {
		this.filters = this.filters
			.filter(filter => filter != null && !filter.range.hasOwnProperty(field))
	}
}