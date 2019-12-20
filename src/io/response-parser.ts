import { isListFacet, isBooleanFacet, isRangeFacet } from '../reducers/facets-data'

function getBuckets(response: any, field: string) {
	const buckets = response.aggregations[field][field].buckets
	return buckets == null ? [] : buckets
}

export default function elasticSearchResponseParser(response: any, facets: FacetsData): FSResponse {
	const facetValues: FSResponse['facetValues'] = {}

	facets.forEach(facet => {
		const buckets = getBuckets(response, facet.id)

		if (isListFacet(facet)) {
			facetValues[facet.id] = {
				total: response.aggregations[`${facet.id}-count`][`${facet.id}-count`].value,
				values: buckets.map((b: any) => ({ key: b.key, count: b.doc_count }))
			}
		}
		else if (isBooleanFacet(facet)) {
			const trueBucket = buckets.find((b: any) => b.key === 1)
			const trueCount = trueBucket != null ? trueBucket.doc_count : 0
			const falseBucket = buckets.find((b: any) => b.key === 0)
			const falseCount = falseBucket != null ? falseBucket.doc_count : 0
			facetValues[facet.id] = {
				true: trueCount,
				false: falseCount
			}
		}
		else if (isRangeFacet(facet)) {
			// const { field, values } = facet

			// if (!values.length) {
				facetValues[facet.id] = buckets.map((hv: any) => ({
					key: hv.key,
					count: hv.doc_count,
				}))
			// }
			// } else {
			// 	facetValues[facet.id] = values

			// 	if (buckets.length) {
			// 		const minValue = values[0].key
			// 		const maxValue = values[values.length - 1].key
			// 		const lowerLimitTimestamp = buckets[0].key as number
			// 		const upperLimitTimestamp = buckets[buckets.length - 1].key as number

			// 		if (
			// 			minValue !== lowerLimitTimestamp ||
			// 			maxValue !== upperLimitTimestamp
			// 		) {
			// 			facetValues[field] = values
			// 			facet.filters = buckets.length ?
			// 				[lowerLimitTimestamp, upperLimitTimestamp] :
			// 				null
			// 		}
			// 	}
			// }

			// facet.interval = response.aggregations[facet.props.field][facet.props.field].interval
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
