"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_emotion_1 = require("react-emotion");
const context_1 = require("../context");
exports.Input = react_emotion_1.default('input') `
	box-sizing: border-box;
	font-size: 1.2em;
	outline: none;
	padding: .5em;
	width: 100%;
`;
class FullTextSearch extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            value: ''
        };
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(exports.Input, { type: "text", onChange: (ev) => {
                    const { value } = ev.target;
                    this.setState({ value });
                    this.props.state.facetsManager.addQuery(value);
                }, placeholder: "Search", value: this.state.value })));
    }
}
exports.default = () => (React.createElement(context_1.default.Consumer, null, state => React.createElement(FullTextSearch, { state: state })));
