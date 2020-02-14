"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const drop_down_1 = tslib_1.__importDefault(require("../../ui/drop-down"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const ActiveFiltersDropDown = styled_1.default(drop_down_1.default) `
	.huc-fs-dropdown-button {
		margin: 0 .5em;
		text-align: right;
	}

	.huc-fs-dropdown-body {
		box-sizing: border-box;
		right: 0;
		width: calc(100% - 32px);

		& > ul > li {
			display: grid;
			grid-template-columns: 140px auto;

			& > ul > li {
				cursor: pointer;
				display: inline-block;
				background: #EEE;
				margin-right: .5rem;
				margin-bottom: .3rem;
				line-height: 1rem;
				padding: 0 .35rem;

				&:hover {
					color: #444;
				}
			}

			&:not(:last-of-type) {
				border-bottom: 1px solid #eee;
			}
		}
	}
`;
function ActiveFiltersDetails(props) {
    return (React.createElement(ActiveFiltersDropDown, { label: `active (${props.filters.reduce((p, c) => p + c.values.length, !props.query.length ? 0 : 1)})`, z: 1001 },
        React.createElement("ul", null,
            props.query.length > 0 &&
                React.createElement("li", null,
                    React.createElement("div", null, "Full text query"),
                    React.createElement("ul", null,
                        React.createElement("li", { onClick: ev => {
                                ev.stopPropagation();
                                props.clearFullTextInput();
                            } }, props.query))),
            props.filters.map(filter => React.createElement("li", { key: filter.id },
                React.createElement("div", null, filter.title),
                React.createElement("ul", null, filter.values.map(value => React.createElement("li", { key: value, onClick: ev => {
                        ev.stopPropagation();
                        props.dispatch({ type: 'remove_filter', facetId: filter.id, value });
                    } }, value))))))));
}
exports.default = React.memo(ActiveFiltersDetails);
