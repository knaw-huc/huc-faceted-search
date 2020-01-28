"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const order_by_1 = tslib_1.__importDefault(require("./order-by"));
const selected_values_1 = tslib_1.__importDefault(require("./selected-values"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const pagination_1 = tslib_1.__importDefault(require("../pagination"));
exports.Header = styled_1.default.header `
	color: #888;
	display: grid;
	font-size: .85em;
	grid-template-rows: auto 48px auto;
	grid-template-columns: 2fr 1fr;

	& > .right {
		justify-self: right;
	}
`;
function HucSearchResults(props) {
    return (React.createElement(exports.Header, null,
        React.createElement(selected_values_1.default, { dispatch: props.dispatch, facetsData: props.facetsData }),
        React.createElement("div", { className: "right" },
            "Found ",
            props.searchResult.total,
            " result",
            props.searchResult.total === 1 ? '' : 's',
            React.createElement(order_by_1.default, { facetsData: props.facetsData, setSortOrder: props.setSortOrder, sortOrder: props.sortOrder })),
        React.createElement(pagination_1.default, { currentPage: props.currentPage, resultsPerPage: props.resultsPerPage, searchResults: props.searchResult, setCurrentPage: props.setCurrentPage })));
}
exports.default = React.memo(HucSearchResults);
