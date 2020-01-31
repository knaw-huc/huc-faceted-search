"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const page_number_1 = require("../page-number");
const option_1 = tslib_1.__importDefault(require("./option"));
const Wrapper = styled_1.default.div `
	display: inline-block;
`;
const SortByButton = styled_1.default(page_number_1.Button) `
	border: 1px solid rgba(0, 0, 0, 0);
	position: relative;
	z-index: 1000;
	transition: all 300ms;

	${(props) => {
    if (props.showMenu) {
        return `
				border: 1px solid #888;
				border-bottom: 1px solid white;
				padding: 0 12px;
			`;
    }
}}
`;
const OrderOptions = styled_1.default.ul `
	background: white;
	border: 1px solid #888;
	left: 32px;
	line-height: 1.6em;
	margin-top: -1px;
	opacity: ${(props) => props.showMenu ? 1 : 0};
	padding: .5em 1em;
	position: absolute;
	transition: opacity 300ms;
	width: 240px;
	z-index: 999;
`;
function OrderBy(props) {
    const [showMenu, setShowMenu] = React.useState(false);
    const handleClick = React.useCallback(ev => {
        ev.stopPropagation();
        const hideMenu = () => setShowMenu(false);
        if (!showMenu)
            window.addEventListener('click', hideMenu);
        else
            window.removeEventListener('click', hideMenu);
        setShowMenu(!showMenu);
    }, [showMenu]);
    return (React.createElement(Wrapper, null,
        React.createElement(SortByButton, { onClick: handleClick, showMenu: showMenu },
            "sort by (",
            props.sortOrder.size,
            ") \u25BE"),
        React.createElement(OrderOptions, { showMenu: showMenu }, Array.from(props.facetsData.values())
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
