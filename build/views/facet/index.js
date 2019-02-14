"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const Wrapper = styled_1.default('div') `
	margin-top: 2em;
`;
class Facet extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            collapsed: false,
            focus: false
        };
    }
    toggleState(field) {
        const nextState = { [field]: !this.state[field] };
        this.setState(nextState);
    }
    render() {
        return (React.createElement(Wrapper, { style: this.props.style }, this.props.children));
    }
}
Facet.defaultProps = {
    style: {}
};
exports.default = Facet;
