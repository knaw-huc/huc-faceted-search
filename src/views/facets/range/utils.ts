const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function ratioToTimestamp(ratio: number, values: RangeFacetValues) {
	const minValue = values[0].key
	const maxValue = values[values.length - 1].key
	return Math.floor(minValue + (ratio * (maxValue - minValue)))
}

export function timestampToRatio(timestamp: number, values: RangeFacetValues) {
	const minValue = values[0].key
	const maxValue = values[values.length - 1].key
	return (timestamp - minValue) / (maxValue - minValue)
}

export function formatRange(facetData: RangeFacetData, rangeMin: number, rangeMax: number): [number | string, number | string] {
	if (facetData.type === 'number') return [rangeMin, rangeMax]

	const dateMin = new Date(rangeMin)
	const yearMin = dateMin.getUTCFullYear()

	const dateMax = new Date(rangeMax)
	const yearMax = dateMax.getUTCFullYear()

	return [formatDate(facetData, rangeMin, yearMin === yearMax), formatDate(facetData, rangeMax)]
}

export function formatDate(facetData: RangeFacetData, num: number, sameYear?: boolean) {
	if (facetData.type === 'number') return num

	let date: string = ''
	const d = new Date(num)
	const year = d.getUTCFullYear()

	if (facetData.interval === 'year' && !sameYear) {
		date = isNaN(year) ? '' : year.toString()
	}
	else if (facetData.interval === 'month') {
		date = `${months[d.getUTCMonth()]}`
		if (!sameYear) date += ` ${year}`
	}
	else if (facetData.interval === 'day') {
		date = `${d.getUTCDate()} ${months[d.getUTCMonth()]}`
		if (!sameYear) date += ` ${year}`
	}

	return date
}
