import { RangeFacet } from '../../../models/facet'

function getBuckets(response: any, field: string) {
	const buckets = response.aggregations[field][field].buckets
	return buckets == null ? [] : buckets
}

const elasticSearchResponseParser: Backend['responseParser'] = function elasticSearchResponseParser(response, facets): FSResponse {
	const facetValues: FSResponse['facetValues'] = {}

	facets.forEach(facet => {
		const buckets = getBuckets(response, facet.field)

		if (facet.type === FacetType.List) {
			facetValues[facet.field] = {
				total: response.aggregations[`${facet.field}-count`].value,
				values: buckets.map((b: any) => ({ key: b.key, count: b.doc_count }))
			}
		}
		else if (facet.type === FacetType.Boolean) {
			const trueBucket = buckets.find((b: any) => b.key === 1)
			const trueCount = trueBucket != null ? trueBucket.doc_count : 0
			const falseBucket = buckets.find((b: any) => b.key === 0)
			const falseCount = falseBucket != null ? falseBucket.doc_count : 0
			facetValues[facet.field] = {
				true: trueCount,
				false: falseCount
			}
		}
		else if (facet.type === FacetType.Range) {
			const rangeFacet = facet as RangeFacet
			const values = rangeFacet.values

			if (!values.length) {
				facetValues[rangeFacet.field] = buckets.map((hv: any) => ({
					key: hv.key,
					count: hv.doc_count,
				}))
			} else {
				facetValues[rangeFacet.field] = values

				if (buckets.length) {
					const minValue = values[0].key
					const maxValue = values[values.length - 1].key
					const lowerLimitTimestamp = buckets[0].key as number
					const upperLimitTimestamp = buckets[buckets.length - 1].key as number

					if (
						minValue !== lowerLimitTimestamp ||
						maxValue !== upperLimitTimestamp
					) {
						rangeFacet.filter = buckets.length ?
							[lowerLimitTimestamp, upperLimitTimestamp] :
							null
					}
				}
			}

			rangeFacet.interval = response.aggregations[facet.field][facet.field].interval
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
		total: response.hits.total.value,
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
