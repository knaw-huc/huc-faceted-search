"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const io_manager_1 = require("./io-manager");
const reset_1 = require("./views/reset");
exports.Reset = reset_1.default;
const Wrapper = react_emotion_1.default('div') `
	font-family: sans-serif;
`;
class FacetedSearch extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.handleChange = (response, facets) => {
            this.setState({ facets, response });
            this.props.onChange(this.state.ioManager.request, response);
        };
        this.state = Object.assign({}, context_1.defaultState, { ioManager: new io_manager_1.default(this.props.url, this.handleChange) });
    }
    render() {
        return (React.createElement(context_1.default.Provider, { value: this.state },
            React.createElement(Wrapper, null, this.props.children)));
    }
}
exports.default = FacetedSearch;
