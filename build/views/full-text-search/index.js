"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_emotion_1 = require("react-emotion");
const context_1 = require("../../context");
const auto_suggest_1 = require("./auto-suggest");
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
        return (React.createElement("div", { style: { position: 'relative' } },
            React.createElement(exports.Input, { type: "text", onChange: (ev) => {
                    this.setQuery(ev.target.value);
                }, placeholder: "Search it", value: this.state.value }),
            this.props.autoSuggest != null &&
                React.createElement(auto_suggest_1.default, { autoSuggest: this.props.autoSuggest, onClick: (query) => this.setQuery(query), value: this.state.value })));
    }
    setQuery(query) {
        this.setState({ value: query });
        this.props.state.facetsManager.addQuery(query);
    }
}
exports.default = (props) => (React.createElement(context_1.default.Consumer, null, state => React.createElement(FullTextSearch, Object.assign({}, props, { state: state }))));
