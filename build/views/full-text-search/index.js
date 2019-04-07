"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const context_1 = tslib_1.__importDefault(require("../../context"));
const auto_suggest_1 = tslib_1.__importDefault(require("./auto-suggest"));
const lodash_debounce_1 = tslib_1.__importDefault(require("lodash.debounce"));
exports.Wrapper = styled_1.default.div `
	background-color: white;
	border: 1px solid #AAA;
	display: grid;
	grid-template-columns: auto 40px;
	position: relative;

	div {
		align-self: center;
		fill: #BBB;
		padding-right: 16px;
	}
`;
exports.Input = styled_1.default.input `
	border: 1px solid #AAA;
	box-sizing: border-box;
	font-size: 1.2em;
	outline: none;
	padding: .5em 0 .5em .5em;
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
        return (React.createElement(exports.Wrapper, null,
            React.createElement(exports.Input, { type: "text", onChange: (ev) => {
                    this.setState({
                        suggest: true,
                        value: ev.target.value
                    });
                    this.requestAddQuery(ev.target.value);
                }, onClick: () => this.setState({ suggest: false }), placeholder: "Search", value: this.state.value }),
            React.createElement("div", null,
                React.createElement("svg", { viewBox: "0 0 250.313 250.313" },
                    React.createElement("path", { d: "M244.186,214.604l-54.379-54.378c-0.289-0.289-0.628-0.491-0.93-0.76 c10.7-16.231,16.945-35.66,16.945-56.554C205.822,46.075,159.747,0,102.911,0S0,46.075,0,102.911 c0,56.835,46.074,102.911,102.91,102.911c20.895,0,40.323-6.245,56.554-16.945c0.269,0.301,0.47,0.64,0.759,0.929l54.38,54.38 c8.169,8.168,21.413,8.168,29.583,0C252.354,236.017,252.354,222.773,244.186,214.604z M102.911,170.146 c-37.134,0-67.236-30.102-67.236-67.235c0-37.134,30.103-67.236,67.236-67.236c37.132,0,67.235,30.103,67.235,67.236 C170.146,140.044,140.043,170.146,102.911,170.146z" }))),
            this.props.autoSuggest != null &&
                this.state.suggest &&
                React.createElement(auto_suggest_1.default, { autoSuggest: this.props.autoSuggest, onClick: this.addQuery, value: this.state.value })));
    }
}
exports.default = React.forwardRef((props, ref) => (React.createElement(context_1.default.Consumer, null, state => React.createElement(FullTextSearch, Object.assign({}, props, { ref: ref, state: state })))));
