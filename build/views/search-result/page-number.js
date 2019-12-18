"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const components_1 = require("./components");
const PageNumberWrapper = styled_1.default(components_1.Prev) `
	background-color: ${(props) => props.active ? '#888' : 'white'};
	border-radius: 1em;
	color: ${(props) => props.active ? 'white' : '#444'};
	font-weight: ${(props) => props.active ? 'bold' : 'normal'};
	text-align: center;
`;
function PageNumber(props) {
    return (React.createElement(PageNumberWrapper, { active: props.pageNumber === props.currentPage, className: props.pageNumber === props.currentPage ? 'active' : null, key: props.pageNumber, onClick: props.setCurrentPage }, props.pageNumber));
}
exports.default = React.memo(PageNumber);
