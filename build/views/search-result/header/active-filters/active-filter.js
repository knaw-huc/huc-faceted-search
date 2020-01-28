"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const Li = styled_1.default.li `
	display: grid;
	grid-template-columns: 120px auto;
	margin-bottom: .4em;

	& > div {
		padding: 2px 0;
	}
`;
const Ul = styled_1.default.ul `
	display: grid;
	grid-template-columns: 140px 140px;
	grid-column-gap: .2em;
`;
const FilterButton = styled_1.default.li `
	align-items: center;
	background: #EEE;
	border-bottom: 1px solid #BBB;
	border-radius: 6px;
	box-sizing: border-box;
	cursor: pointer;
	display: grid;
	grid-template-columns: 120px 20px;
	height: 24px;
	width: 140px;

	& > span:first-of-type {
		justify-self: right;
		max-width: calc(100% - 6px);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	& > span:last-of-type {
		justify-self: center;
	}
`;
function ActiveFilter(props) {
    return (React.createElement(Li, null,
        React.createElement("div", null, props.filter.title),
        React.createElement(Ul, null, props.filter.values.map(value => React.createElement(FilterButton, { key: value, onClick: () => {
                props.dispatch({ type: 'remove_filter', facetId: props.filter.id, value });
            }, title: value },
            React.createElement("span", null, value),
            React.createElement("span", null, "\u2716"))))));
}
exports.default = React.memo(ActiveFilter);
