"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const core_1 = require("@emotion/core");
const Wrapper = styled_1.default('li') `
	cursor: pointer;
	display: grid;
	grid-template-columns: 24px 4fr 1fr;
	margin-bottom: .2em;
`;
const common = (props) => core_1.css `
	color: ${props.active ? '#444' : '#888'};
	font-size: .9em;
	font-weight: ${props.active ? 'bold' : 'normal'};
`;
const Key = styled_1.default('span') `
	${common}
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;
const Count = styled_1.default('span') `
	${common}
	text-align: right;
`;
function FacetValueView(props) {
    const handleChange = React.useCallback(() => {
        const type = props.active ? 'remove_filter' : 'add_filter';
        props.facetsDataDispatch({ type, facetId: props.facetId, value: props.value.key });
    }, [props.active, props.facetId, props.value.key]);
    return (React.createElement(Wrapper, { onClick: handleChange, title: props.value.key },
        React.createElement("input", { checked: props.active, onChange: handleChange, type: "checkbox" }),
        React.createElement(Key, { active: props.active, dangerouslySetInnerHTML: { __html: props.keyFormatter(props.value.key) } }),
        React.createElement(Count, { active: props.active }, props.value.count)));
}
FacetValueView.defaultProps = {
    keyFormatter: (value) => value
};
exports.default = React.memo(FacetValueView);
