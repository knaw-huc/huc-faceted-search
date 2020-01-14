"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const list_1 = tslib_1.__importDefault(require("./views/facets/list"));
const boolean_1 = tslib_1.__importDefault(require("./views/facets/boolean"));
const range_1 = tslib_1.__importDefault(require("./views/facets/range"));
const reset_1 = tslib_1.__importDefault(require("./views/reset"));
const request_creator_1 = tslib_1.__importDefault(require("./io/request-creator"));
const constants_1 = require("./constants");
const response_parser_1 = tslib_1.__importDefault(require("./io/response-parser"));
const full_text_search_1 = tslib_1.__importDefault(require("./views/full-text-search"));
const search_result_1 = tslib_1.__importDefault(require("./views/search-result"));
const facets_data_1 = tslib_1.__importDefault(require("./reducers/facets-data"));
const Wrapper = styled_1.default.div `
	margin-bottom: 10vh;

	${(props) => {
    if (!props.disableDefaultStyle) {
        return `
				display: grid;
				font-family: sans-serif;
				grid-template-columns: minmax(32px, auto) 352px minmax(320px, 672px) minmax(32px, auto);
				
				& > aside {
					grid-column: 2;
					padding-right: 32px;
				}

				& > section {
					grid-column: 3;
					padding-left: 32px;
				}
			`;
    }
}}
`;
const initialSearchResult = {
    facetValues: {},
    results: [],
    total: 0
};
function useSearchResult(url, options) {
    const [searchResult, setSearchResult] = React.useState(initialSearchResult);
    React.useEffect(() => {
        const searchRequest = new request_creator_1.default(options);
        constants_1.fetchSearchResults(url, searchRequest)
            .then(result => {
            const searchResponse = response_parser_1.default(result, options.facetsData);
            setSearchResult(searchResponse);
        })
            .catch(err => {
            console.log(err);
        });
    }, [url, ...Object.keys(options).map((opt) => options[opt])]);
    return searchResult;
}
function FacetedSearch(props) {
    const [query, setQuery] = React.useState('');
    const [currentPage, setCurrentPage] = React.useState(1);
    const [sortOrder, setSortOrder] = React.useState(new Map());
    const [facetsData, facetsDataDispatch] = facets_data_1.default(props.fields);
    const searchResult = useSearchResult(props.url, {
        currentPage,
        facetsData,
        resultFields: props.resultFields,
        resultsPerPage: props.resultsPerPage,
        query,
        sortOrder,
    });
    return (React.createElement(Wrapper, { className: props.className, disableDefaultStyle: props.disableDefaultStyle, id: "huc-fs" },
        React.createElement("aside", null,
            React.createElement(full_text_search_1.default, { autoSuggest: props.autoSuggest, setQuery: setQuery }),
            React.createElement(reset_1.default, { onClick: () => {
                    setQuery('');
                    setSortOrder(new Map());
                    facetsDataDispatch({ type: 'clear', fields: props.fields });
                } }),
            React.createElement("div", null, Array.from(facetsData.values())
                .map(facetData => {
                const values = searchResult.facetValues[facetData.id];
                if (constants_1.isListFacet(facetData)) {
                    return (React.createElement(list_1.default, { facetData: facetData, facetsDataDispatch: facetsDataDispatch, key: facetData.id, values: values }));
                }
                else if (constants_1.isBooleanFacet(facetData)) {
                    return (React.createElement(boolean_1.default, { facetData: facetData, facetsDataDispatch: facetsDataDispatch, key: facetData.id, values: values }));
                }
                else if (constants_1.isRangeFacet(facetData)) {
                    return (React.createElement(range_1.default, { facetData: facetData, facetsDataDispatch: facetsDataDispatch, key: facetData.id, values: values }));
                }
                else {
                    return null;
                }
            }))),
        React.createElement(search_result_1.default, { currentPage: currentPage, facetsData: facetsData, onClickResult: props.onClickResult, ResultBodyComponent: props.ResultBodyComponent, resultBodyProps: props.resultBodyProps, resultsPerPage: props.resultsPerPage, searchResult: searchResult, setCurrentPage: setCurrentPage, setSortOrder: setSortOrder, sortOrder: sortOrder })));
}
FacetedSearch.defaultProps = {
    fields: [],
    resultFields: [],
    resultsPerPage: 10,
};
exports.default = React.memo(FacetedSearch);
