"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
const page_number_1 = require("../page-number");
const Wrapper = styled_1.default.div `
	border-bottom: 1px solid #eee;
	color: ${(props) => props.active ? '#666' : 'inherit'};
	display: grid;
	grid-template-columns: 8fr 2fr;
	grid-gap: 1em;
	text-transform: capitalize;
	white-space: nowrap;

	&:last-of-type {
		border: 0;
	}

	& > .title {
		cursor: pointer;
		font-size: ${(props) => props.active ? '1.1em' : '1em'};
		font-weight: ${(props) => props.active ? 'bold' : 'normal'};
	}

	& > .toggle-direction {
		justify-self: end;
	}
`;
function updateSortOrder(sortOrder, facetId, direction = "desc") {
    if (sortOrder.has(facetId) && sortOrder.get(facetId) === direction)
        sortOrder.delete(facetId);
    else
        sortOrder.set(facetId, direction);
    return new Map(sortOrder);
}
function OrderOption(props) {
    const setDirection = React.useCallback(ev => {
        ev.stopPropagation();
        const nextDirection = props.sortOrder.get(props.facetData.id) === "desc" ?
            "asc" :
            "desc";
        const nextSortOrder = updateSortOrder(props.sortOrder, props.facetData.id, nextDirection);
        props.setSortOrder(nextSortOrder);
    }, [props.sortOrder, props.facetData]);
    const setFacetId = React.useCallback(ev => {
        ev.stopPropagation();
        const direction = props.sortOrder.get(props.facetData.id);
        const nextSortOrder = updateSortOrder(props.sortOrder, props.facetData.id, direction);
        props.setSortOrder(nextSortOrder);
    }, [props.sortOrder, props.facetData]);
    const direction = props.sortOrder.get(props.facetData.id);
    return (React.createElement(Wrapper, { active: direction != null, key: props.facetData.id, onClick: setFacetId },
        React.createElement("div", { className: "title" }, props.facetData.title || props.facetData.id),
        direction != null &&
            React.createElement(page_number_1.Button, { className: "toggle-direction", onClick: setDirection, title: direction === "desc" ? 'Descending' : 'Ascending' }, direction === "desc" ? '▼' : '▲')));
}
exports.default = React.memo(OrderOption);
