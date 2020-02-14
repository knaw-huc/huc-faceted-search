"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const order_by_1 = tslib_1.__importDefault(require("./order-by"));
const active_filters_1 = tslib_1.__importDefault(require("./active-filters"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const pagination_1 = tslib_1.__importDefault(require("./pagination"));
const Wrapper = styled_1.default.header `
	align-items: center;
	background: white;
	border-bottom: 1px solid #EEE;
	color: #888;
	display: grid;
	font-size: .85em;
	grid-template-rows: 24px 48px;
	grid-template-columns: 1fr 1fr;
	padding-top: 32px;
	position: sticky;
	top: -54px;

	& > #huc-fs-active-filters {
		grid-column: 1 / span 2;
		padding-left: 32px;
	}

	& > .right {
		grid-column: 1;
		grid-row: 2;
		padding-left: 32px;
		height: 48px;
		line-height: 46px;
	}

	& > .pagination {
		grid-column: 2;
		grid-row: 2;
	}
`;
function Header(props) {
    let from = (props.currentPage - 1) * props.resultsPerPage + 1;
    if (from > props.searchResult.total)
        from = props.searchResult.total;
    let to = from + props.resultsPerPage - 1;
    if (to > props.searchResult.total)
        to = props.searchResult.total;
    return (React.createElement(Wrapper, { id: "huc-fs-header" },
        React.createElement(active_filters_1.default, { clearActiveFilters: props.clearActiveFilters, clearFullTextInput: props.clearFullTextInput, dispatch: props.dispatch, facetsData: props.facetsData, query: props.query }),
        React.createElement("div", { className: "right" },
            from,
            "-",
            to,
            " of ",
            props.searchResult.total,
            " result",
            props.searchResult.total === 1 ? '' : 's',
            ",\u00A0",
            React.createElement(order_by_1.default, { facetsData: props.facetsData, setSortOrder: props.setSortOrder, sortOrder: props.sortOrder })),
        React.createElement(pagination_1.default, { currentPage: props.currentPage, resultsPerPage: props.resultsPerPage, searchResults: props.searchResult, setCurrentPage: props.setCurrentPage })));
}
exports.default = React.memo(Header);
