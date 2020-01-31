"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const page_number_1 = require("../header/page-number");
const Wrapper = styled_1.default.div `
	display: inline-block;
`;
const DropDownButton = styled_1.default(page_number_1.Button) `
	border: 1px solid rgba(0, 0, 0, 0);
	position: relative;
	transition: all 300ms;
	white-space: nowrap;
	z-index: ${props => props.z + 1};

	& > span {
		font-size: .65rem;
	}

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
const Body = styled_1.default.div `
	background: white;
	border: 1px solid #888;
	line-height: 1.6em;
	margin-top: -1px;
	opacity: ${(props) => props.showMenu ? 1 : 0};
	padding: .5em 1em;
	pointer-events: ${props => props.showMenu ? 'all' : 'none'};
	position: absolute;
	transition: opacity 300ms;
	z-index: ${props => props.z};
`;
function DropDown(props) {
    const [showMenu, setShowMenu] = React.useState(false);
    const hideMenu = React.useCallback(() => setShowMenu(false), []);
    const handleClick = React.useCallback(ev => {
        ev.stopPropagation();
        setShowMenu(!showMenu);
    }, [showMenu]);
    React.useEffect(() => {
        if (showMenu)
            window.addEventListener('click', hideMenu);
        else
            window.removeEventListener('click', hideMenu);
        return () => {
            window.removeEventListener('click', hideMenu);
        };
    }, [showMenu]);
    return (React.createElement(Wrapper, { className: props.className },
        React.createElement(DropDownButton, { className: "huc-fs-dropdown-button", onClick: handleClick, showMenu: showMenu, z: props.z },
            props.label,
            " ",
            React.createElement("span", null, showMenu ? '▲' : '▼')),
        React.createElement(Body, { className: "huc-fs-dropdown-body", showMenu: showMenu, z: props.z }, props.children)));
}
exports.default = React.memo(DropDown);
