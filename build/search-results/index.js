"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const components_1 = require("./components");
class HucSearchResults extends React.PureComponent {
    render() {
        return (React.createElement(components_1.Section, null,
            React.createElement(components_1.Header, null,
                React.createElement("div", null,
                    "Found ",
                    this.props.searchResults.total,
                    " result",
                    this.props.searchResults.total === 1 ? '' : 's')),
            React.createElement(components_1.ResultList, null, this.props.searchResults.hits.map((hit, i) => React.createElement(components_1.Result, { key: i, onClick: (ev) => {
                    if (this.props.onClickResult != null)
                        this.props.onClickResult(hit, ev);
                } },
                React.createElement(this.props.resultBodyComponent, { result: hit }))))));
    }
}
HucSearchResults.defaultProps = {
    searchResults: {
        hits: [],
        id: null,
        query: {},
        total: 0,
    }
};
exports.default = HucSearchResults;
