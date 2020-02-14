export default class ESRequest {
	_source: { include?: AppProps['resultFields'], exclude?: AppProps['excludeResultFields'] }
	from: number
	size: number
	sort: any

	constructor(options: ElasticSearchRequestOptions) {
		this.setSource(options)
		this.size = options.resultsPerPage
		if (options.currentPage > 1) this.from = this.size * (options.currentPage - 1) 
		if (options.sortOrder.size) {
			this.sort = []
			options.sortOrder.forEach((sortDirection, facetId) => {
				this.sort.push({[facetId]: sortDirection})
			})
			this.sort.push('_score')
		}
	}

	private setSource(options: ElasticSearchRequestOptions) {
		if (!options.resultFields.length && !options.excludeResultFields.length) return

		this._source = {
			include: options.resultFields,
			exclude: options.excludeResultFields
		}
	}
}
