import { isListFacet, isBooleanFacet, isRangeFacet } from '../constants'

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

			facetValues[facet.id] = [
				{ key: 'true', count: trueCount },
				{ key: 'false', count: falseCount },
			]
		}
		else if (isRangeFacet(facet)) {
			// TODO set values to from and to, so we have to calculate less in the views
			facetValues[facet.id] = buckets.map((hv: any) => ({
				key: hv.key,
				count: hv.doc_count,
			}))

			facet.interval = response.aggregations[facet.id][facet.id].interval
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
