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
