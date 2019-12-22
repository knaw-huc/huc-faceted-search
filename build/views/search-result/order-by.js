"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const page_number_1 = require("./page-number");
const Wrapper = styled_1.default.div `
	justify-self: end;	
	position: relative;
`;
const OrderOptions = styled_1.default.ul `
	background: yellow;
	padding: .5em;
	position: absolute;
	right: 0;
	width: 200px;
	z-index: 999;

	& > li {
		cursor: pointer;
		text-transform: capitalize;
	}
`;
function OrderBy(props) {
    const [showMenu, setShowMenu] = React.useState(false);
    return (React.createElement(Wrapper, null,
        React.createElement(page_number_1.Button, { onClick: () => setShowMenu(!showMenu) }, "Order by \u25BE"),
        showMenu &&
            React.createElement(OrderOptions, null, props.fields
                .sort((field1, field2) => {
                const a = props.sortOrder.has(field1.id);
                const b = props.sortOrder.has(field2.id);
                if (a === b)
                    return field1.order - field2.order;
                return a ? -1 : 1;
            })
                .map(field => React.createElement("li", { key: field.id, onClick: () => props.setSortOrder(field.id, "desc") },
                React.createElement("input", { checked: props.sortOrder.has(field.id), readOnly: true, type: "checkbox" }),
                props.sortOrder.has(field.id),
                field.title || field.id)))));
}
exports.default = React.memo(OrderBy);
