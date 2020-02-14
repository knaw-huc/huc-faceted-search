"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ESResponseParser(response) {
    return {
        results: response.hits.hits
            .map((hit) => (Object.assign({ id: hit._id, snippets: hit.highlight ? hit.highlight.text : [] }, hit._source))),
        total: response.hits.total.value,
    };
}
exports.default = ESResponseParser;
