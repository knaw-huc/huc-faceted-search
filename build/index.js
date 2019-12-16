"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const context_1 = tslib_1.__importStar(require("./context"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const facets_1 = tslib_1.__importDefault(require("./views/facets"));
exports.Facets = facets_1.default;
const list_facet_1 = tslib_1.__importDefault(require("./views/list-facet"));
exports.ListFacet = list_facet_1.default;
const range_facet_1 = tslib_1.__importDefault(require("./views/range-facet"));
exports.RangeFacet = range_facet_1.default;
const boolean_facet_1 = tslib_1.__importDefault(require("./views/boolean-facet"));
exports.BooleanFacet = boolean_facet_1.default;
const full_text_search_1 = tslib_1.__importDefault(require("./views/full-text-search"));
exports.FullTextSearch = full_text_search_1.default;
const facets_manager_1 = tslib_1.__importDefault(require("./facets-manager"));
const reset_1 = tslib_1.__importDefault(require("./views/reset"));
exports.Reset = reset_1.default;
const search_results_1 = tslib_1.__importDefault(require("./search-results"));
exports.SearchResults = search_results_1.default;
const io_manager_1 = tslib_1.__importDefault(require("./io-manager"));
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
class FacetedSearch extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, context_1.defaultState, { facetsManager: new facets_manager_1.default({
                onChange: () => this.ioManager.sendRequest(this.state.facetsManager.getFacets(), this.state.facetsManager.query)
            }) });
        this.ioManager = new io_manager_1.default({
            backend: props.backend,
            resultFields: props.resultFields,
            resultsPerPage: props.resultsPerPage,
            url: props.url,
            onChange: (changeResponse) => {
                this.state.facetsManager.update(changeResponse.response);
                props.onChange(Object.assign({}, changeResponse, { query: this.state.facetsManager.query }));
                this.setState({ searchResult: changeResponse.response });
            }
        });
        this.props.getResultBodyComponent().then(ResultBodyComponent => this.setState({ ResultBodyComponent }));
    }
    render() {
        if (this.state.ResultBodyComponent == null)
            return null;
        return (React.createElement(context_1.default.Provider, { value: this.state },
            React.createElement(Wrapper, { className: this.props.className, disableDefaultStyle: this.props.disableDefaultStyle, id: "huc-fs" },
                React.createElement("aside", null,
                    React.createElement(full_text_search_1.default, { autoSuggest: this.props.autoSuggest }),
                    React.createElement(reset_1.default, null),
                    React.createElement(facets_1.default, null, this.props.children)),
                React.createElement(search_results_1.default, { pageNumber: this.ioManager.currentPage, goToPage: pageNumber => this.ioManager.goToPage(pageNumber, this.state.facetsManager.getFacets()), onClickResult: this.props.onClickResult, resultBodyComponent: this.state.ResultBodyComponent, resultBodyProps: this.props.resultBodyProps, resultsPerPage: this.props.resultsPerPage, state: this.state }))));
    }
    addFilter(field, key) {
        this.state.facetsManager.reset();
        this.state.facetsManager.addFilter(field, key);
    }
    getPrevNext(id) {
        return this.ioManager.getPrevNext(id);
    }
    getFilters() {
        return this.state.facetsManager.getFacets()
            .reduce((prev, curr) => {
            if (curr.filters == null)
                return prev;
            prev[curr.field] = [...curr.filters];
            return prev;
        }, {});
    }
}
FacetedSearch.defaultProps = {
    backend: 'none',
    disableDefaultStyle: false,
    onChange: () => { },
    resultFields: [],
    resultsPerPage: 10,
    resultBodyProps: {}
};
exports.default = FacetedSearch;
