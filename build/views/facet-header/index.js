"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const Header = styled_1.default('header') `
	display: grid;
	grid-template-columns: 2fr 1fr;
`;
const H3 = styled_1.default('h3') `
	margin: 0 0 .5em 0;
`;
class FacetHeader extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            focus: false
        };
    }
    render() {
        return (React.createElement(Header, { onMouseEnter: () => this.setState({ focus: true }), onMouseLeave: () => this.setState({ focus: false }) },
            React.createElement(H3, null, this.props.title),
            this.state.focus && this.props.children));
    }
}
exports.default = FacetHeader;
