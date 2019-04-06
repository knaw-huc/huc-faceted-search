"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const value_1 = tslib_1.__importDefault(require("./value"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const more_less_buttons_1 = tslib_1.__importDefault(require("./more-less-buttons"));
const DURATION = 500;
const FRAME_DURATION = 16;
function easeOutQuint(t) { return 1 + (--t) * t * t * t * t; }
const Wrapper = styled_1.default('div') `
	overflow: hidden;
`;
const List = styled_1.default('ul') `
	margin: 0;
	padding: 0;
`;
class FacetValuesView extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.wrapperRef = React.createRef();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.facet != null && prevProps.facet.values.length !== this.props.facet.values.length)
            this.setHeight();
        if (!prevProps.collapsed && this.props.collapsed)
            this.animate();
        else if (prevProps.collapsed && !this.props.collapsed)
            this.animate(true);
    }
    render() {
        if (this.props.facet == null)
            return null;
        return (React.createElement(Wrapper, { ref: this.wrapperRef },
            React.createElement(List, null, this.props.facet.values.map(value => React.createElement(value_1.default, { addFilter: () => this.props.state.facetsManager.addFilter(this.props.field, value.key), active: this.props.state.facetsManager.getListFacet(this.props.field).filters.has(value.key), key: value.key, removeFilter: () => this.props.state.facetsManager.removeFilter(this.props.field, value.key), value: value }))),
            React.createElement(more_less_buttons_1.default, Object.assign({}, this.props))));
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
