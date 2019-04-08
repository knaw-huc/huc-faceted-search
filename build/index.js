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
const Wrapper = styled_1.default('div') `
	font-family: sans-serif;
`;
class FacetedSearch extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, context_1.defaultState, { facetsManager: new facets_manager_1.default() });
        this.ioManager = new io_manager_1.default({ backend: props.backend, url: props.url }, this.state.facetsManager);
        this.ioManager.onChange = (response) => {
            props.onChange(response);
            this.setState({ cycle: this.state.cycle++ });
        };
    }
    render() {
        return (React.createElement(context_1.default.Provider, { value: this.state },
            React.createElement(Wrapper, null, this.props.children)));
    }
    addFilter(field, key) {
        this.state.facetsManager.addFilter(field, key);
    }
    getNext() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.ioManager.getNext();
        });
    }
}
FacetedSearch.defaultProps = {
    backend: 'none'
};
exports.default = FacetedSearch;
