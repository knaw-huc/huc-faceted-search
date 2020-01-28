"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const Li = styled_1.default.li `
	display: grid;
	grid-template-columns: auto auto;
`;
const Ul = styled_1.default.ul `
	& > li {
		display: inline-block;
	}
`;
function ActiveFilter(props) {
    return (React.createElement(Li, null,
        React.createElement("div", null, props.filter.title),
        React.createElement(Ul, null, props.filter.values.map(value => React.createElement("li", { key: value }, value)))));
}
exports.default = React.memo(ActiveFilter);
