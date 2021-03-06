"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const boolean_1 = tslib_1.__importDefault(require("./views/facets/boolean"));
const hierarchy_1 = tslib_1.__importDefault(require("./views/facets/hierarchy"));
const date_1 = tslib_1.__importDefault(require("./views/facets/date"));
const list_1 = tslib_1.__importDefault(require("./views/facets/list"));
const range_1 = tslib_1.__importDefault(require("./views/facets/range"));
const constants_1 = require("./constants");
const header_1 = tslib_1.__importDefault(require("./views/header"));
const search_result_1 = tslib_1.__importDefault(require("./views/search-result"));
const full_text_search_1 = tslib_1.__importDefault(require("./views/full-text-search"));
const facets_data_1 = tslib_1.__importDefault(require("./reducers/facets-data"));
const use_search_1 = tslib_1.__importDefault(require("./use-search"));
const Wrapper = styled_1.default.div `
	margin-bottom: 10vh;

	${(props) => {
    if (!props.disableDefaultStyle) {
        return `
				display: grid;
				font-family: sans-serif;
				grid-template-columns: minmax(32px, auto) 352px minmax(320px, 672px) minmax(32px, auto);
				grid-template-rows: 104px auto;

				& > #huc-full-text-search {
					grid-column: 2;
				}

				& > #huc-fs-header {
					grid-column: 3;
				}
				
				& > #huc-fs-facets {
					grid-column: 2;
					grid-row: 2;
					margin-bottom: 10vh;
					padding-right: 32px;
				}

				& > #huc-fs-search-results {
					grid-column: 3;
					grid-row: 2;
					padding-left: 32px;
				}
			`;
    }
}}
`;
function FacetedSearch(props) {
    const [query, setQuery] = React.useState('');
    const [currentPage, setCurrentPage] = React.useState(1);
    const [sortOrder, setSortOrder] = React.useState(new Map());
    const [facetsData, facetsDataDispatch] = facets_data_1.default(props.fields);
    const [searchResult, facetValues] = use_search_1.default(props.url, {
        currentPage,
        excludeResultFields: props.excludeResultFields,
        facetsData,
        resultFields: props.resultFields,
        resultsPerPage: props.resultsPerPage,
        query,
        sortOrder,
        track_total_hits: props.track_total_hits
    });
    const clearActiveFilters = React.useCallback(() => {
        setQuery('');
        setSortOrder(new Map());
        facetsDataDispatch({ type: 'clear', fields: props.fields });
    }, [props.fields]);
    const clearFullTextInput = React.useCallback(() => {
        setQuery('');
    }, []);
    if (facetsData == null)
        return null;
    return (React.createElement(Wrapper, { className: props.className, disableDefaultStyle: props.disableDefaultStyle, id: "huc-fs" },
        React.createElement(full_text_search_1.default, { autoSuggest: props.autoSuggest, setQuery: setQuery, query: query }),
        React.createElement(header_1.default, { autoSuggest: props.autoSuggest, clearActiveFilters: clearActiveFilters, clearFullTextInput: clearFullTextInput, currentPage: currentPage, dispatch: facetsDataDispatch, facetsData: facetsData, searchResult: searchResult, query: query, resultsPerPage: props.resultsPerPage, setCurrentPage: setCurrentPage, setSortOrder: setSortOrder, sortOrder: sortOrder }),
        React.createElement("div", { id: "huc-fs-facets" }, Array.from(facetsData.values())
            .map(facetData => {
            const values = facetValues[facetData.id];
            if (constants_1.isListFacet(facetData)) {
                return (React.createElement(list_1.default, { facetData: facetData, facetsDataDispatch: facetsDataDispatch, key: facetData.id, values: values }));
            }
            else if (constants_1.isBooleanFacet(facetData)) {
                return (React.createElement(boolean_1.default, { facetData: facetData, facetsDataDispatch: facetsDataDispatch, key: facetData.id, values: values }));
            }
            else if (constants_1.isHierarchyFacet(facetData)) {
                return (React.createElement(hierarchy_1.default, { facetData: facetData, facetsDataDispatch: facetsDataDispatch, key: facetData.id, values: values }));
            }
            else if (constants_1.isDateFacet(facetData)) {
                return (React.createElement(date_1.default, { facetData: facetData, facetsDataDispatch: facetsDataDispatch, key: facetData.id, values: values }));
            }
            else if (constants_1.isRangeFacet(facetData)) {
                return (React.createElement(range_1.default, { facetData: facetData, facetsDataDispatch: facetsDataDispatch, key: facetData.id, values: values }));
            }
            else {
                return null;
            }
        })),
        React.createElement(search_result_1.default, { onClickResult: props.onClickResult, ResultBodyComponent: props.ResultBodyComponent, resultBodyProps: props.resultBodyProps, searchResult: searchResult })));
}
FacetedSearch.defaultProps = {
    excludeResultFields: [],
    fields: [],
    resultFields: [],
    resultsPerPage: 10,
};
exports.default = React.memo(FacetedSearch);
