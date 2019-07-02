import { RangeFacet } from '../../../models/facet'

const elasticSearchResponseParser: Backend['responseParser'] = function elasticSearchResponseParser(response, facets) {
	const facetValues: FSResponse['facetValues'] = response.aggregations

	facets.forEach(facet => {
		if (facet.type === FacetType.List) {
			facetValues[facet.id] = {
				total: response.aggregations[facet.id][`${facet.field}-count`].value,
				values: response.aggregations[facet.id][facet.field].buckets.map((b: any) => ({ key: b.key, count: b.doc_count }))
			}
		}
		else if (facet.type === FacetType.Boolean) {
			const trueBucket = response.aggregations[facet.id][facet.field].buckets.find((b: any) => b.key === 1)
			const trueCount = trueBucket != null ? trueBucket.doc_count : 0
			const falseBucket = response.aggregations[facet.id][facet.field].buckets.find((b: any) => b.key === 0)
			const falseCount = falseBucket != null ? falseBucket.doc_count : 0
			facetValues[facet.id] = {
				true: trueCount,
				false: falseCount
			}
		}
		else if (facet.type === FacetType.Range) {
			const rangeResponse = response.aggregations[facet.id][facet.field]
			facetValues[facet.id] = [rangeResponse.min, rangeResponse.max]

			const histogramAggs = response.aggregations[`${facet.id}_histogram`]
			let histogramValues: any[] = histogramAggs.hasOwnProperty('buckets') ? histogramAggs.buckets : histogramAggs.date_histogram.buckets;
			if (histogramValues == null) histogramValues = []
			histogramValues = histogramValues.map(hv => ({
				key: hv.key,
				count: hv.doc_count,
			}));
			(facet as RangeFacet).histogramValues = histogramValues
			
			// if ((facet as RangeFacet).histogramValues == null) {
			// } else {
			// 	(facet as RangeFacet).filteredHistogramValues = histogramValues
			// }
		}
	})

	return {
		facetValues,
		results: response.hits.hits
			.map((hit: any): Hit => ({
				id: hit._id,
				snippets: hit.highlight ? hit.highlight.text : [],
				...hit._source
			})),
		total: response.hits.total,
	}
}

export default elasticSearchResponseParser


	// private updateBooleanFacets() {
	// 	this.facetsManager.getFacets(FacetType.Boolean)
	// 		.forEach(facet => {
	// 			if (!this.response.aggregations.hasOwnProperty(facet.id)) return
	// 			let { buckets } = this.response.aggregations[facet.id][facet.field] as { buckets: ListFacetValue[] }
	// 			facet.values = Array.isArray(buckets) ? buckets : []
	// 			facet.values = facet.values.map(value => {
	// 				value.key = value.key.toString()
	// 				return value
	// 			})
	// 			if (facet.values.length === 1) {
	// 				if (facet.values[0].key === '1') facet.values.push({ key: '0', doc_count: 0 })
	// 				else facet.values = [{ key: '1', doc_count: 0 }].concat(facet.values[0])
	// 			}
	// 		})
	// }

	// private updateListFacets() {
	// 	this.facetsManager.getFacets(FacetType.List)
	// 		.forEach((facet) => {
	// 			if (!this.response.aggregations.hasOwnProperty(facet.id)) return
	// 			let { buckets } = this.response.aggregations[facet.id][facet.field] as { buckets: ListFacetValue[] }
	// 			facet.values = Array.isArray(buckets) ? buckets : []

	// 			const { value } = this.response.aggregations[facet.id][`${facet.field}-count`]
	// 			facet.total = value
	// 		})
	// }

	// private updateRangeFacets() {
	// 	this.facetsManager.getFacets(FacetType.Range)
	// 		.forEach(facet => {
	// 			if (!this.response.aggregations.hasOwnProperty(facet.id)) return
	// 			const { min, max } = this.response.aggregations[facet.id][facet.field]
	// 			if (!facet.values.filter(v => v != null).length && min != null && max != null) facet.values = [min, max]

	// 			const histogramAggs = this.response.aggregations[`${facet.id}_histogram`]
	// 			let histogramValues = histogramAggs.hasOwnProperty('buckets') ? histogramAggs.buckets : histogramAggs.date_histogram.buckets
	// 			facet.histogramValues = histogramValues != null ? histogramValues : []
	// 		})
	// }
