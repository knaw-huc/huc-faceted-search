"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const utils_1 = require("./utils");
const Wrapper = styled_1.default.div `
	display: grid;
	grid-template-columns: repeat(${(props) => props.barCount}, 1fr);
	grid-column-gap: 4px;
`;
const Bar = styled_1.default.div `
	align-items: end;
	border: 1px solid white;
	box-sizing: border-box;
	height: 100%;
	cursor: ${(props) => props.count > 0 ? 'pointer' : 'default'}};
	display: grid;

	&:hover {
		border: 1px solid #b6b6b6;
		& > div {
			background: #b6b6b6;
		}
	}
`;
const BarFill = styled_1.default.div `
	background: #e6e6e6;
	height: ${(props) => {
    let height = props.height;
    if (height > 0 && height < .03)
        height = .03;
    return `${height * 100}px`;
}};
`;
function Histogram(props) {
    const counts = props.values.map(v => v.count);
    const maxCount = Math.max(...counts);
    const handleBarClick = React.useCallback((ev) => {
        const { count, value } = ev.currentTarget.dataset;
        if (count === '0')
            return;
        const from = parseInt(value, 10);
        const to = utils_1.getEndDate(from, props.facetData.interval);
        props.facetsDataDispatch({ type: 'set_range', facetId: props.facetData.id, from, to });
    }, [props.values]);
    return (React.createElement(Wrapper, { barCount: props.values.length }, props.values.map(value => React.createElement(Bar, { count: value.count, "data-count": value.count, "data-value": value.key, key: Math.random(), onClick: handleBarClick },
        React.createElement(BarFill, { height: value.count / maxCount })))));
}
exports.default = React.memo(Histogram);
