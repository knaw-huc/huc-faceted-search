"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const components_1 = require("./components");
const pagination_1 = tslib_1.__importDefault(require("./pagination"));
const order_by_1 = tslib_1.__importDefault(require("./order-by"));
function HucSearchResults(props) {
    return (React.createElement(components_1.Section, { id: "huc-fs-search-results" },
        React.createElement(components_1.Header, null,
            React.createElement("div", null,
                "Found ",
                props.searchResult.total,
                " result",
                props.searchResult.total === 1 ? '' : 's'),
            React.createElement(order_by_1.default, { facetsData: props.facetsData, setSortOrder: props.setSortOrder, sortOrder: props.sortOrder }),
            React.createElement(pagination_1.default, { currentPage: props.currentPage, resultsPerPage: props.resultsPerPage, searchResults: props.searchResult, setCurrentPage: props.setCurrentPage })),
        React.createElement(components_1.ResultList, null, props.searchResult.results.map((hit, i) => React.createElement(components_1.Result, { key: i, onClick: (ev) => {
                if (props.onClickResult != null)
                    props.onClickResult(hit, ev);
            } },
            React.createElement(props.ResultBodyComponent, Object.assign({}, props.resultBodyProps, { result: hit }))))),
        React.createElement(pagination_1.default, { currentPage: props.currentPage, resultsPerPage: props.resultsPerPage, searchResults: props.searchResult, setCurrentPage: props.setCurrentPage })));
}
exports.default = React.memo(HucSearchResults);
