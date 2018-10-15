"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const context_1 = tslib_1.__importDefault(require("../context"));
class Facets extends React.PureComponent {
    componentDidMount() {
        if (Array.isArray(this.props.children)) {
            this.props.state.facetsManager.setFacetCount(this.props.children.length);
        }
    }
    render() {
        return this.props.children;
    }
}
exports.default = (props) => (React.createElement(context_1.default.Consumer, null, state => React.createElement(Facets, { state: state }, React.Children.map(props.children, (child, index) => {
    return React.cloneElement(child, { state, index });
}))));
