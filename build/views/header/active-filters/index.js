"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const page_number_1 = require("../page-number");
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const use_filters_1 = tslib_1.__importDefault(require("./use-filters"));
const details_1 = tslib_1.__importDefault(require("./details"));
const Wrapper = styled_1.default.div `
	line-height: 24px;

	& > * {
		display: inline-block;
	}

	& > ul {
		overflow: hidden;
		width: 100%;
		white-space: nowrap;

		& > li {
			box-sizing: border-box;
			cursor: pointer;
			display: inline-block;
			margin-right: .5em;
			max-width: 100px;
			overflow: hidden;
			text-decoration: underline;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
`;
function ActiveFilters(props) {
    const filters = use_filters_1.default(props.facetsData);
    if (!props.query.length && !filters.length)
        return null;
    return (React.createElement(Wrapper, { id: "huc-fs-active-filters" },
        "filters:",
        React.createElement(details_1.default, { clearFullTextInput: props.clearFullTextInput, dispatch: props.dispatch, filters: filters, query: props.query }),
        React.createElement(page_number_1.Button, { onClick: props.clearActiveFilters }, "clear")));
}
exports.default = React.memo(ActiveFilters);
{
}
