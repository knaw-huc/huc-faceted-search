"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_emotion_1 = tslib_1.__importDefault(require("react-emotion"));
const context_1 = tslib_1.__importDefault(require("../../context"));
const auto_suggest_1 = tslib_1.__importDefault(require("./auto-suggest"));
const lodash_debounce_1 = tslib_1.__importDefault(require("lodash.debounce"));
exports.Input = react_emotion_1.default('input') `
	background-color: white;
	border: 1px solid #AAA;
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
            suggest: false,
            value: ''
        };
        this.addQuery = (query) => {
            this.setState({ suggest: false, value: query });
            this._addQuery(query);
        };
        this._addQuery = (query) => {
            this.props.state.facetsManager.addQuery(query);
        };
        this.requestAddQuery = lodash_debounce_1.default(this._addQuery, 300);
    }
    render() {
        return (React.createElement("div", { style: { position: 'relative' } },
            React.createElement(exports.Input, { type: "text", onChange: (ev) => {
                    this.setState({
                        suggest: true,
                        value: ev.target.value
                    });
                    this.requestAddQuery(ev.target.value);
                }, onClick: () => this.setState({ suggest: false }), placeholder: "Search", value: this.state.value }),
            this.props.autoSuggest != null &&
                this.state.suggest &&
                React.createElement(auto_suggest_1.default, { autoSuggest: this.props.autoSuggest, onClick: this.addQuery, value: this.state.value })));
    }
}
exports.default = React.forwardRef((props, ref) => (React.createElement(context_1.default.Consumer, null, state => React.createElement(FullTextSearch, Object.assign({}, props, { ref: ref, state: state })))));
