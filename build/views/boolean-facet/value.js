"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_emotion_1 = tslib_1.__importStar(require("react-emotion"));
const Wrapper = react_emotion_1.default('li') `
	cursor: pointer;
	display: grid;
	grid-template-columns: 24px 4fr 1fr;
	margin-bottom: .2em;
`;
const common = (props) => react_emotion_1.css `
	color: ${props.active ? '#444' : '#888'};
	font-size: .9em;
	font-weight: ${props.active ? 'bold' : 'normal'};
`;
const Key = react_emotion_1.default('span') `
	${common}
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;
const Count = react_emotion_1.default('span') `
	${common}
	text-align: right;
`;
class FacetValueView extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            active: this.props.active
        };
        this.toggleActive = () => {
            const nextActive = !this.state.active;
            if (nextActive)
                this.props.addFilter();
            else
                this.props.removeFilter();
            this.setState({ active: nextActive });
        };
    }
    static getDerivedStateFromProps(props) {
        return { active: props.active };
    }
    render() {
        return (React.createElement(Wrapper, { onClick: this.toggleActive, title: this.props.value.key },
            React.createElement("input", { checked: this.state.active, onChange: this.toggleActive, type: "checkbox" }),
            React.createElement(Key, Object.assign({}, this.state), this.props.value.key),
            React.createElement(Count, Object.assign({}, this.state), this.props.value.doc_count)));
    }
}
FacetValueView.defaultProps = {
    active: false
};
exports.default = FacetValueView;
