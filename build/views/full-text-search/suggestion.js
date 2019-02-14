"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const Li = styled_1.default('li') `
	background: ${(props) => props.hover ? '#EEE' : '#FFF'};
	border-bottom: 1px solid #CCC;
	cursor: pointer;
	padding: .5em;
`;
class Suggestion extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            hover: false,
        };
    }
    render() {
        return (React.createElement(Li, { onClick: () => this.props.onClick(this.props.value), onMouseEnter: () => this.setState({ hover: true }), onMouseLeave: () => this.setState({ hover: false }), hover: this.state.hover }, this.props.value));
    }
}
exports.default = Suggestion;
