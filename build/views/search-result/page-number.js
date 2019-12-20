"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
exports.Button = styled_1.default.div `
	cursor: pointer;
	user-select: none;

	&:hover {
		color: #444;
	}
`;
const PageNumberWrapper = styled_1.default(exports.Button) `
	background-color: ${(props) => props.active ? '#f6f6f6' : 'white'};
	border-radius: .25em;
	color: ${(props) => props.active ? '#888' : 'inherit'};
	font-weight: ${(props) => props.active ? 'bold' : 'normal'};
	padding: .35em;
	text-align: center;
`;
function PageNumber(props) {
    return (React.createElement(PageNumberWrapper, { active: props.pageNumber === props.currentPage, key: props.pageNumber, onClick: props.setCurrentPage }, props.pageNumber));
}
exports.default = React.memo(PageNumber);
