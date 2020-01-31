"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const option_1 = tslib_1.__importDefault(require("./option"));
const drop_down_1 = tslib_1.__importDefault(require("../../ui/drop-down"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const SortByDropDown = styled_1.default(drop_down_1.default) `
	& > .huc-fs-dropdown-button {
		height: 46px;
	}

	& > .huc-fs-dropdown-body {
		left: 32px;
		width: 240px;
	}
`;
function SortBy(props) {
    return (React.createElement(SortByDropDown, { label: `sort by (${props.sortOrder.size})`, z: 998 }, Array.from(props.facetsData.values())
        .sort((field1, field2) => {
        const a = props.sortOrder.has(field1.id);
        const b = props.sortOrder.has(field2.id);
        if (a === b)
            return field1.order - field2.order;
        return a ? -1 : 1;
    })
        .map(field => React.createElement(option_1.default, { facetData: field, key: field.id, sortOrder: props.sortOrder, setSortOrder: props.setSortOrder }))));
}
exports.default = React.memo(SortBy);
