"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
exports.Section = styled_1.default.section ``;
exports.Header = styled_1.default.header `
	color: #888;
	display: grid;
	font-size: .85em;
	grid-template-rows: 32px auto;
`;
exports.ResultList = styled_1.default.ul `
	list-style: none;
	margin: 0;
	padding: 0;
`;
exports.Result = styled_1.default.li `
	cursor: pointer;
`;
exports.Prev = styled_1.default.div `
	cursor: pointer;
	line-height: 1.8em;
	user-select: none;
	width: 1.8em;
`;
exports.Next = styled_1.default(exports.Prev) `
	text-align: right;
`;
