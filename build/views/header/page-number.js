"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const constants_1 = require("../../constants");
exports.Button = styled_1.default.div `
	color: ${constants_1.SPOT_COLOR};
	cursor: pointer;
	user-select: none;
`;
const PageNumberWrapper = styled_1.default(exports.Button) `
	background-color: ${(props) => props.active ? constants_1.BACKGROUND_GRAY : 'white'};
	border-radius: .25em;
	color: ${(props) => props.active ? '#888' : 'inherit'};
	font-weight: ${(props) => props.active ? 'bold' : 'normal'};
	padding: .35em;
	text-align: center;
`;
function PageNumber(props) {
    const active = props.pageNumber === props.currentPage;
    return (React.createElement(PageNumberWrapper, { active: active, className: active ? 'active' : null, key: props.pageNumber, onClick: props.setCurrentPage }, props.pageNumber));
}
exports.default = React.memo(PageNumber);
