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
function useAnimate(collapse, ref) {
    React.useEffect(() => {
        let elapsed = 0;
        const listHeight = ref.current.getBoundingClientRect().height;
        const interval = setInterval(() => {
            elapsed += FRAME_DURATION;
            let ratio = easeOutQuint(elapsed / DURATION);
            if (collapse)
                ratio = 1 - ratio;
            let currentHeight = `${listHeight * ratio}px`;
            if (elapsed > DURATION) {
                currentHeight = !collapse ? 'auto' : '0';
                clearInterval(interval);
            }
            ref.current.style.height = currentHeight;
        }, FRAME_DURATION);
    }, [collapse]);
}
function FacetValuesView(props) {
    const ref = React.useRef();
    useAnimate(props.collapse, ref);
    return (React.createElement(Wrapper, { ref: ref },
        React.createElement(List, null, props.values.values
            .map(value => React.createElement(value_1.default, { active: props.facetData.filters.has(value.key.toString()), facetData: props.facetData, facetsDataDispatch: props.facetsDataDispatch, key: value.key, value: value }))),
        React.createElement(more_less_buttons_1.default, { facetData: props.facetData, facetsDataDispatch: props.facetsDataDispatch, values: props.values })));
}
exports.default = React.memo(FacetValuesView);
