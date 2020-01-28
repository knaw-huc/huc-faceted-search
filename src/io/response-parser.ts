import { isListFacet, isBooleanFacet, isRangeFacet, isDateFacet } from '../constants'

function getBuckets(response: any, field: string, useValues = false) {
	const prop = useValues ? 'values' : 'buckets'
	const buckets = response.aggregations[field][field][prop]
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
		else if (isDateFacet(facet)) {
			// TODO set values to from and to, so we have to calculate less in the views
			facetValues[facet.id] = buckets.map((hv: any) => ({
				key: hv.key,
				count: hv.doc_count,
			}))

			facet.interval = response.aggregations[facet.id][facet.id].interval
		}
		else if (isRangeFacet(facet)) {
			// const values: Record<string, number> = getBuckets(response, facet.id, true)
			// let sum = 0
			facetValues[facet.id] = buckets.map((hv: any) => ({
				key: hv.key,
				count: hv.doc_count,
			}))

			// facetValues[facet.id] = Object.keys(values)
			// 	.reduce((prev, curr, index, array) => {
			// 		const prevCount = index > 0 ? values[array[index - 1]] : 0
			// 		const count = values[curr] - prevCount
			// 		const to = Math.ceil(sum + count)

			// 		prev.push({
			// 			count,
			// 			key: count,
			// 			from: sum,
			// 			to, 
			// 		})

			// 		sum = to

			// 		return prev	
			// 	}, [] as RangeKeyCount[])
			// 	.slice(1)
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
