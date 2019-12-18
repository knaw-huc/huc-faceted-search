"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const list_facet_1 = tslib_1.__importDefault(require("./views/list-facet"));
const reset_1 = tslib_1.__importDefault(require("./views/reset"));
const request_creator_1 = tslib_1.__importDefault(require("./io-manager/backends/elasticsearch/request-creator"));
const io_manager_1 = require("./io-manager");
const response_parser_1 = tslib_1.__importDefault(require("./io-manager/backends/elasticsearch/response-parser"));
const facets_data_1 = tslib_1.__importStar(require("./reducers/facets-data"));
const full_text_search_1 = tslib_1.__importDefault(require("./views/full-text-search"));
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
function useSearchResult(url, options) {
    const [searchResult, setSearchResult] = React.useState(null);
    React.useEffect(() => {
        const searchRequest = new request_creator_1.default(options);
        io_manager_1.fetchSearchResults(url, searchRequest)
            .then(result => {
            const searchResponse = response_parser_1.default(result, options.facetsData);
            setSearchResult(searchResponse);
        })
            .catch(err => {
            console.log(err);
        });
    }, [url, options.resultFields, options.facetsData, options.query]);
    return searchResult;
}
function FacetedSearch(props) {
    const [query, setQuery] = React.useState('');
    const [facetsData, facetsDataDispatch] = React.useReducer(facets_data_1.default, props.fields, facets_data_1.facetsDataReducerInit);
    const searchResult = useSearchResult(props.url, {
        facetsData,
        resultFields: props.resultFields,
        query,
    });
    return (React.createElement(Wrapper, { className: props.className, disableDefaultStyle: props.disableDefaultStyle, id: "huc-fs" },
        React.createElement("aside", null,
            React.createElement(full_text_search_1.default, { autoSuggest: props.autoSuggest, setQuery: setQuery }),
            React.createElement(reset_1.default, { onClick: () => {
                    setQuery('');
                    facetsDataDispatch({ type: 'clear' });
                } }),
            React.createElement("div", null, facetsData != null &&
                props.fields.map(facetConfig => {
                    var _a;
                    if (facetConfig.datatype === "keyword") {
                        const values = (_a = searchResult) === null || _a === void 0 ? void 0 : _a.facetValues[facetConfig.id];
                        return (React.createElement(list_facet_1.default, { addFacetQuery: value => facetsDataDispatch({ type: 'set_query', facetId: facetConfig.id, value }), addFilter: value => facetsDataDispatch({ type: 'add_filter', facetId: facetConfig.id, value }), facetData: facetsData.get(facetConfig.id), key: facetConfig.id, removeFilter: value => facetsDataDispatch({ type: 'remove_filter', facetId: facetConfig.id, value }), sortListFacet: (by, direction) => facetsDataDispatch(({ type: 'set_sort', facetId: facetConfig.id, by, direction })), values: values, viewLess: () => facetsDataDispatch({ type: 'view_less', facetId: facetConfig.id }), viewMore: () => { var _a; return facetsDataDispatch({ type: 'view_more', facetId: facetConfig.id, total: (_a = values) === null || _a === void 0 ? void 0 : _a.total }); } }));
                    }
                    else {
                        return null;
                    }
                })))));
}
FacetedSearch.defaultProps = {
    resultFields: [],
    resultsPerPage: 10,
};
exports.default = React.memo(FacetedSearch);
