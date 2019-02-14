"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const constants_1 = require("../constants");
const Button = styled_1.default('button') `
	background: none;
	border: none;
	color: ${constants_1.SPOT_COLOR};
	cursor: pointer;
	outline: none;
	padding: 0;
`;
exports.MoreLessButton = styled_1.default(Button) `
	margin-left: 24px;
`;
exports.FacetMenuButton = styled_1.default(Button) `
	width: 24px;
`;
exports.default = Button;
