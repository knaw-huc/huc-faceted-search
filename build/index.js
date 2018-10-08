"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = require("react");
const facets_1 = require("./views/facets");
exports.Facets = facets_1.default;
const list_facet_1 = require("./views/list-facet");
exports.ListFacet = list_facet_1.default;
const range_facet_1 = require("./views/range-facet");
exports.RangeFacet = range_facet_1.default;
const full_text_search_1 = require("./views/full-text-search");
exports.FullTextSearch = full_text_search_1.default;
const context_1 = require("./context");
const react_emotion_1 = require("react-emotion");
const facets_manager_1 = require("./facets-manager");
const reset_1 = require("./views/reset");
exports.Reset = reset_1.default;
const dispatch_1 = require("./dispatch");
const Wrapper = react_emotion_1.default('div') `
	font-family: sans-serif;
`;
class FacetedSearch extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleChange = (inputFacets, query) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { facets, response } = yield this.ioManager.dispatch(inputFacets, query);
            this.setState({ facets, response });
            this.props.onChange(this.ioManager.requestBody, response);
        });
        this.ioManager = new dispatch_1.default({ backend: this.props.backend, url: props.url });
        this.state = Object.assign({}, context_1.defaultState, { facetsManager: new facets_manager_1.default(this.handleChange) });
    }
    render() {
        return (React.createElement(context_1.default.Provider, { value: this.state },
            React.createElement(Wrapper, null, this.props.children)));
    }
}
FacetedSearch.defaultProps = {
    backend: 'none'
};
exports.default = FacetedSearch;
