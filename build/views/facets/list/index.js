"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const values_1 = tslib_1.__importDefault(require("./values"));
const header_1 = tslib_1.__importDefault(require("../header"));
const button_1 = require("../../button");
const options_1 = tslib_1.__importDefault(require("./options"));
const facet_1 = tslib_1.__importDefault(require("../facet"));
function ListFacet(props) {
    const [collapse, setCollapse] = React.useState(false);
    const [options, setOptions] = React.useState(false);
    return (React.createElement(facet_1.default, null,
        React.createElement(header_1.default, { facetData: props.facetData },
            React.createElement("div", { style: { textAlign: 'right' } },
                React.createElement(button_1.FacetMenuButton, { onClick: () => {
                        setCollapse(!collapse);
                        setOptions(false);
                    } },
                    React.createElement("svg", { viewBox: "0 0 401.998 401.998", width: "12px", height: "12px", fill: "#AAA" },
                        React.createElement("g", null,
                            React.createElement("path", { d: "M73.092,164.452h255.813c4.949,0,9.233-1.807,12.848-5.424c3.613-3.616,5.427-7.898,5.427-12.847\n\t\t\t\t\t\t\t\t\tc0-4.949-1.813-9.229-5.427-12.85L213.846,5.424C210.232,1.812,205.951,0,200.999,0s-9.233,1.812-12.85,5.424L60.242,133.331\n\t\t\t\t\t\t\t\t\tc-3.617,3.617-5.424,7.901-5.424,12.85c0,4.948,1.807,9.231,5.424,12.847C63.863,162.645,68.144,164.452,73.092,164.452z" }),
                            React.createElement("path", { d: "M328.905,237.549H73.092c-4.952,0-9.233,1.808-12.85,5.421c-3.617,3.617-5.424,7.898-5.424,12.847\n\t\t\t\t\t\t\t\t\tc0,4.949,1.807,9.233,5.424,12.848L188.149,396.57c3.621,3.617,7.902,5.428,12.85,5.428s9.233-1.811,12.847-5.428l127.907-127.906\n\t\t\t\t\t\t\t\t\tc3.613-3.614,5.427-7.898,5.427-12.848c0-4.948-1.813-9.229-5.427-12.847C338.139,239.353,333.854,237.549,328.905,237.549z" })))),
                React.createElement(button_1.FacetMenuButton, { onClick: () => {
                        setCollapse(false);
                        setOptions(!options);
                    } },
                    React.createElement("svg", { viewBox: "0 0 21.589 21.589", width: "12px", height: "12px", fill: "#AAA" },
                        React.createElement("path", { d: "M18.622,8.371l-0.545-1.295c0,0,1.268-2.861,1.156-2.971l-1.679-1.639c-0.116-0.113-2.978,1.193-2.978,1.193l-1.32-0.533\n\t\t\t\t\t\t\t\t\tc0,0-1.166-2.9-1.326-2.9H9.561c-0.165,0-1.244,2.906-1.244,2.906L6.999,3.667c0,0-2.922-1.242-3.034-1.131L2.289,4.177\n\t\t\t\t\t\t\t\t\tC2.173,4.29,3.507,7.093,3.507,7.093L2.962,8.386c0,0-2.962,1.141-2.962,1.295v2.322c0,0.162,2.969,1.219,2.969,1.219l0.545,1.291\n\t\t\t\t\t\t\t\t\tc0,0-1.268,2.859-1.157,2.969l1.678,1.643c0.114,0.111,2.977-1.195,2.977-1.195l1.321,0.535c0,0,1.166,2.898,1.327,2.898h2.369\n\t\t\t\t\t\t\t\t\tc0.164,0,1.244-2.906,1.244-2.906l1.322-0.535c0,0,2.916,1.242,3.029,1.133l1.678-1.641c0.117-0.115-1.22-2.916-1.22-2.916\n\t\t\t\t\t\t\t\t\tl0.544-1.293c0,0,2.963-1.143,2.963-1.299v-2.32C21.59,9.425,18.622,8.371,18.622,8.371z M14.256,10.794\n\t\t\t\t\t\t\t\t\tc0,1.867-1.553,3.387-3.461,3.387c-1.906,0-3.461-1.52-3.461-3.387s1.555-3.385,3.461-3.385\n\t\t\t\t\t\t\t\t\tC12.704,7.41,14.256,8.927,14.256,10.794z" }))))),
        options &&
            React.createElement(options_1.default, Object.assign({}, props)),
        React.createElement(values_1.default, { addFilter: props.addFilter, facetData: props.facetData, removeFilter: props.removeFilter, collapse: collapse, values: props.values, viewLess: props.viewLess, viewMore: props.viewMore })));
}
ListFacet.defaultProps = {
    filters: new Set,
    size: 10,
    values: {
        values: [],
        total: 0
    }
};
exports.default = React.memo(ListFacet);
