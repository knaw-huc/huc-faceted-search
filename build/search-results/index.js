"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const components_1 = require("./components");
const pagination_1 = tslib_1.__importDefault(require("./pagination"));
class HucSearchResults extends React.PureComponent {
    render() {
        return (React.createElement(components_1.Section, null,
            React.createElement(components_1.Header, null,
                React.createElement("div", null,
                    "Found ",
                    this.props.state.searchResult.total,
                    " result",
                    this.props.state.searchResult.total === 1 ? '' : 's'),
                React.createElement(pagination_1.default, { goToPage: this.props.goToPage, pageNumber: this.props.pageNumber, resultsPerPage: this.props.resultsPerPage, searchResults: this.props.state.searchResult })),
            React.createElement(components_1.ResultList, null, this.props.state.searchResult.hits.map((hit, i) => React.createElement(components_1.Result, { key: i, onClick: (ev) => {
                    if (this.props.onClickResult != null)
                        this.props.onClickResult(hit, ev);
                } },
                React.createElement(this.props.resultBodyComponent, Object.assign({}, this.props.resultBodyProps, { result: hit }))))),
            React.createElement(pagination_1.default, { goToPage: this.props.goToPage, pageNumber: this.props.pageNumber, resultsPerPage: this.props.resultsPerPage, searchResults: this.props.state.searchResult })));
    }
}
exports.default = HucSearchResults;
