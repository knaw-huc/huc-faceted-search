"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_emotion_1 = require("react-emotion");
const button_1 = require("../button");
const Header = react_emotion_1.default('header') `
	display: grid;
	grid-template-columns: 2fr 1fr;
`;
const H3 = react_emotion_1.default('h3') `
	margin: 0 0 .5em 0;
`;
class FacetHeader extends React.PureComponent {
    render() {
        return (React.createElement(Header, null,
            React.createElement(H3, null, this.props.title),
            this.props.focus &&
                React.createElement(button_1.FacetMenuButton, { onClick: this.props.collapse }, "<")));
    }
}
exports.default = FacetHeader;
