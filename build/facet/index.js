"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_emotion_1 = require("react-emotion");
const Wrapper = react_emotion_1.default('div') `
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
