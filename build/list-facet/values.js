"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const value_1 = require("./value");
const react_emotion_1 = require("react-emotion");
const button_1 = require("../button");
const DURATION = 500;
const FRAME_DURATION = 16;
function easeOutQuint(t) { return 1 + (--t) * t * t * t * t; }
const Wrapper = react_emotion_1.default('div') `
	overflow: hidden;
`;
const List = react_emotion_1.default('ul') `
	margin: 0;
	padding: 0;
`;
class FacetValuesView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            values: []
        };
        this.wrapperRef = React.createRef();
    }
    static getDerivedStateFromProps(props) {
        const { facets } = props.state;
        const values = (facets == null || !facets.hasOwnProperty(props.field)) ?
            [] :
            facets[props.field].values;
        return { values };
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.values.length !== this.state.values.length)
            this.setHeight();
        if (!prevProps.collapsed && this.props.collapsed)
            this.animate();
        else if (prevProps.collapsed && !this.props.collapsed)
            this.animate(true);
    }
    render() {
        return (React.createElement(Wrapper, { innerRef: this.wrapperRef },
            React.createElement(List, null, this.state.values.map(value => React.createElement(value_1.default, { addFilter: () => this.props.state.ioManager.addListFilter(this.props.field, value.key), key: value.key, removeFilter: () => this.props.state.ioManager.removeListFilter(this.props.field, value.key), value: value }))),
            React.createElement(button_1.MoreLessButton, { onClick: () => this.props.state.ioManager.viewMoreFacetValues(this.props.field) }, "View more"),
            this.state.values.length && this.props.size !== this.state.values.length &&
                React.createElement(button_1.MoreLessButton, { onClick: () => this.props.state.ioManager.viewLessFacetValues(this.props.field) }, "View less")));
    }
    animate(reverse = false) {
        let elapsed = 0;
        const interval = setInterval(() => {
            elapsed += FRAME_DURATION;
            let ratio = easeOutQuint(elapsed / DURATION);
            if (!reverse)
                ratio = 1 - ratio;
            let currentHeight = `${this.listHeight * ratio}px`;
            if (elapsed > DURATION) {
                currentHeight = reverse ? 'auto' : '0';
                clearInterval(interval);
            }
            this.wrapperRef.current.style.height = currentHeight;
        }, FRAME_DURATION);
    }
    setHeight() {
        if (this.listHeight == null || this.listHeight > 0) {
            this.listHeight = this.wrapperRef.current.getBoundingClientRect().height;
        }
    }
}
exports.default = FacetValuesView;
