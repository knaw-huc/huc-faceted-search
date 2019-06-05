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
	${(props) => {
    if (!props.disableDefaultStyle) {
        return `
				display: grid;
				font-family: sans-serif;
				grid-template-columns: minmax(32px, auto) 352px minmax(320px, 672px) minmax(32px, auto);
				margin-bottom: 10vh;
				
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
        this.state = Object.assign({}, context_1.defaultState, { facetsManager: new facets_manager_1.default() });
        this.ioManager = new io_manager_1.default({ backend: props.backend, resultsPerPage: props.resultsPerPage, url: props.url }, this.state.facetsManager);
        this.ioManager.onChange = (changeResponse) => {
            props.onChange(changeResponse);
            this.setState({ searchResult: changeResponse.response });
        };
    }
    render() {
        return (React.createElement(context_1.default.Provider, { value: this.state },
            React.createElement(Wrapper, { className: this.props.className, disableDefaultStyle: this.props.disableDefaultStyle },
                React.createElement("aside", null,
                    React.createElement(full_text_search_1.default, { autoSuggest: () => tslib_1.__awaiter(this, void 0, void 0, function* () { return []; }) }),
                    React.createElement(reset_1.default, null),
                    React.createElement(facets_1.default, null, this.props.children)),
                React.createElement(search_results_1.default, { pageNumber: this.ioManager.currentPage, goToPage: this.ioManager.goToPage, onClickResult: this.props.onClickResult, resultBodyComponent: this.props.resultBodyComponent, resultBodyProps: this.props.resultBodyProps, resultsPerPage: this.props.resultsPerPage, state: this.state }))));
    }
    addFilter(field, key) {
        this.state.facetsManager.addFilter(field, key);
    }
    getPrevNext(id) {
        return this.ioManager.getPrevNext(id);
    }
}
FacetedSearch.defaultProps = {
    backend: 'none',
    disableDefaultStyle: false,
    resultsPerPage: 10,
    resultBodyProps: {}
};
exports.default = FacetedSearch;
