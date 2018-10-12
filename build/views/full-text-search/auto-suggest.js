"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = require("react");
const suggestion_1 = require("./suggestion");
const react_emotion_1 = require("react-emotion");
const Suggestions = react_emotion_1.default('ul') `
	box-sizing: border-box;
	list-style: none;
	margin: 0;
	padding: 0;
	position: absolute;
	width: calc(100% - 100px);
	border-left: 1px solid #CCC;
	border-right: 1px solid #CCC;
	border-bottom: 0;
	z-index: 1;
`;
class AutoSuggest extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            suggestions: []
        };
    }
    componentDidUpdate(prevProps, prevState) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (prevState.suggestions.length && !this.state.suggestions.length)
                return;
            if (prevProps.value !== this.props.value) {
                const suggestions = yield this.props.autoSuggest(this.props.value);
                this.setState({ suggestions });
            }
        });
    }
    render() {
        return (React.createElement(Suggestions, null, this.state.suggestions.map((suggestion, index) => React.createElement(suggestion_1.default, { key: index, onClick: (query) => {
                this.setState({ suggestions: [] });
                this.props.onClick(query);
            }, value: suggestion }))));
    }
}
exports.default = AutoSuggest;
