"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ESRequest {
    constructor(options) {
        this.setSource(options);
        this.size = options.resultsPerPage;
        if (options.currentPage > 1)
            this.from = this.size * (options.currentPage - 1);
        if (options.sortOrder.size) {
            this.sort = [];
            options.sortOrder.forEach((sortDirection, facetId) => {
                this.sort.push({ [facetId]: sortDirection });
            });
            this.sort.push('_score');
        }
    }
    setSource(options) {
        if (!options.resultFields.length && !options.excludeResultFields.length)
            return;
        this._source = {
            include: options.resultFields,
            exclude: options.excludeResultFields
        };
    }
}
exports.default = ESRequest;
