import { isListFacet, isBooleanFacet, isRangeFacet, isDateFacet, isHierarchyFacet, getChildFieldName } from '../constants'

interface Bucket {
	key: string | number
	doc_count: number
	[key: string]: any
}
function getBuckets(response: any, field: string, useValues = false): Bucket[] {
	const prop = useValues ? 'values' : 'buckets'
	const buckets = response.aggregations[field][field][prop]
	return buckets == null ? [] : buckets
}

function addHierarchyBucket(parentField: string, response: any): (bucket: Bucket) => HierarchyKeyCount {
	return function(bucket: Bucket) {
		const childField = getChildFieldName(parentField)
		let child: HierarchyFacetValues = null
		if (bucket.hasOwnProperty(childField)) {
			// console.log('DO IT')

			// console.log(bucket)
			// console.log(childField, bucket[childField])
			const buckets: Bucket[] = bucket[childField][childField].buckets

			if (buckets.length) {
				const values = buckets.map(addHierarchyBucket(childField, response))
				child = {
					total: response.aggregations[`${childField}-count`][`${childField}-count`].value,
					values, 
				}
			}
		}
		return {
			key: bucket.key.toString(),
			count: bucket.doc_count,
			child,
		}	
	}
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
		if (isHierarchyFacet(facet)) {
			const values: HierarchyFacetValues = {
				total: response.aggregations[`${facet.id}-count`][`${facet.id}-count`].value,
				values: buckets.map(addHierarchyBucket(facet.id, response))
				// child: addHierarchyValue(facet.id)
				// child: null
			}

			facetValues[facet.id] = values
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
			facetValues[facet.id] = buckets.map(hv => ({
				key: hv.key,
				count: hv.doc_count,
			})) as RangeFacetValues

			facet.interval = response.aggregations[facet.id][facet.id].interval
		}
		else if (isRangeFacet(facet)) {
			// const values: Record<string, number> = getBuckets(response, facet.id, true)
			// let sum = 0
			facetValues[facet.id] = buckets.map(hv => ({
				key: hv.key,
				count: hv.doc_count,
			})) as RangeFacetValues

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
