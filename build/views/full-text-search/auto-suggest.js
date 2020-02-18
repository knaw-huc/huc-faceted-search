"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const lodash_debounce_1 = tslib_1.__importDefault(require("lodash.debounce"));
const drop_down_1 = require("../ui/drop-down");
const SuggestionsDropDownBody = styled_1.default(drop_down_1.DropDownBody) `
	border-top: 0;
	margin-top: 1px;
`;
class AutoSuggest extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.cache = {};
        this.state = {
            suggestions: []
        };
        this.autoSuggest = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let suggestions;
            if (this.cache.hasOwnProperty(this.props.value)) {
                suggestions = this.cache[this.props.value];
            }
            else {
                suggestions = yield this.props.autoSuggest(this.props.value);
                this.cache[this.props.value] = suggestions;
            }
            this.setState({ suggestions });
        });
        this.requestAutoSuggest = lodash_debounce_1.default(this.autoSuggest, 300);
    }
    componentDidUpdate(prevProps, prevState) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (prevState.suggestions.length && !this.state.suggestions.length)
                return;
            if (prevProps.value !== this.props.value) {
                this.requestAutoSuggest();
            }
        });
    }
    render() {
        return (React.createElement(SuggestionsDropDownBody, { show: this.state.suggestions.length > 0 }, this.state.suggestions.map((suggestion, index) => React.createElement("div", { key: index, onClick: () => {
                this.setState({ suggestions: [] });
                this.props.onClick(suggestion);
            } }, suggestion))));
    }
}
exports.default = AutoSuggest;
