"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const page_number_1 = require("../page-number");
const option_1 = tslib_1.__importDefault(require("./option"));
const Wrapper = styled_1.default.div `
	justify-self: end;	
	position: relative;
`;
const OrderOptions = styled_1.default.ul `
	background: white;
	border: 1px solid #888;
	line-height: 1.6em;
	padding: .5em 1em;
	position: absolute;
	right: 0;
	width: 240px;
	z-index: 999;
`;
function OrderBy(props) {
    const [showMenu, setShowMenu] = React.useState(false);
    return (React.createElement(Wrapper, null,
        React.createElement(page_number_1.Button, { onClick: () => setShowMenu(!showMenu) }, "Order by \u25BE"),
        showMenu &&
            React.createElement(OrderOptions, null, Array.from(props.facetsData.values())
                .sort((field1, field2) => {
                const a = props.sortOrder.has(field1.id);
                const b = props.sortOrder.has(field2.id);
                if (a === b)
                    return field1.order - field2.order;
                return a ? -1 : 1;
            })
                .map(field => React.createElement(option_1.default, { facetData: field, key: field.id, sortOrder: props.sortOrder, setSortOrder: props.setSortOrder })))));
}
exports.default = React.memo(OrderBy);
