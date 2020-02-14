"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const request_with_facets_creator_1 = tslib_1.__importDefault(require("./request-with-facets-creator"));
const response_with_facets_parser_1 = tslib_1.__importDefault(require("./response-with-facets-parser"));
const request_creator_1 = tslib_1.__importDefault(require("./request-creator"));
const response_parser_1 = tslib_1.__importDefault(require("./response-parser"));
const react_1 = tslib_1.__importDefault(require("react"));
const fetch_1 = tslib_1.__importDefault(require("./fetch"));
const initialSearchResult = {
    results: [],
    total: 0
};
function useSearch(url, options) {
    const [searchResult, setSearchResult] = react_1.default.useState(initialSearchResult);
    const [facetValues, setFacetValues] = react_1.default.useState({});
    react_1.default.useEffect(() => {
        const searchRequest = new request_creator_1.default(options);
        fetch_1.default(url, searchRequest)
            .then(result => {
            const searchResponse = response_parser_1.default(result);
            setSearchResult(searchResponse);
        })
            .catch(err => {
            console.log(err);
        });
    }, [url, options.currentPage, options.excludeResultFields, options.resultFields, options.resultsPerPage, options.sortOrder]);
    react_1.default.useEffect(() => {
        if (options.facetsData == null)
            return;
        const searchRequest = new request_with_facets_creator_1.default(options);
        fetch_1.default(url, searchRequest)
            .then(result => {
            const [searchResponse, facetValues] = response_with_facets_parser_1.default(result, options.facetsData);
            setSearchResult(searchResponse);
            setFacetValues(facetValues);
        })
            .catch(err => {
            console.log(err);
        });
    }, [url, options.facetsData, options.query]);
    return [searchResult, facetValues];
}
exports.default = useSearch;
