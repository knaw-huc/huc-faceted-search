"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const Header = styled_1.default('header') `
	display: grid;
	grid-template-columns: 2fr 1fr;
`;
const H3 = styled_1.default('h3') `
	color: #444;
	font-size: 1rem;
	margin: 0 0 .5em 0;
`;
function FacetHeader(props) {
    const [focus, setFocus] = React.useState(false);
    return (React.createElement(Header, { onMouseEnter: () => setFocus(true), onMouseLeave: () => setFocus(false) },
        React.createElement(H3, null, props.title),
        focus && props.children));
}
exports.default = React.memo(FacetHeader);
