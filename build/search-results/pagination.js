"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const styled_1 = tslib_1.__importDefault(require("@emotion/styled"));
function getRange(start, end) {
    return Array.from({ length: end - start + 1 }, (_value, key) => key + start);
}
const Wrapper = styled_1.default.div `
	display: grid;
	grid-template-columns: 32px auto 32px;
	margin: 0 .2em 1em .2em;

	& > div:last-of-type {
		justify-self: end;
	}
`;
const PageNumbers = styled_1.default.div `
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(32px, 1fr));
	justify-items: center;
`;
const Prev = styled_1.default.div `
	cursor: pointer;
	line-height: 1.8em;
	user-select: none;
	width: 1.8em;
`;
const Next = styled_1.default(Prev) `
	text-align: right;
`;
const PageNumber = styled_1.default(Prev) `
	background-color: ${(props) => props.active ? '#888' : 'white'};
	border-radius: 1em;
	color: ${(props) => props.active ? 'white' : '#444'};
	font-weight: ${(props) => props.active ? 'bold' : 'normal'};
	text-align: center;
`;
class Pagination extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.toPageNumber = (pageNumber) => React.createElement(PageNumber, { active: pageNumber === this.props.pageNumber, key: pageNumber, onClick: () => this.handlePageNumberClick(pageNumber) }, pageNumber);
        this.handlePageNumberClick = (pageNumber) => {
            this.setState({ pageNumber });
            this.props.goToPage(pageNumber);
        };
    }
    componentDidUpdate(prevProps) {
        if (prevProps.searchResults.total !== this.props.searchResults.total) {
            this.setState({ pageNumber: 1 });
        }
    }
    render() {
        const pageCount = Math.ceil(this.props.searchResults.total / this.props.resultsPerPage);
        if (isNaN(pageCount) || pageCount === 1)
            return null;
        const { first, current, last } = this.getPages(pageCount);
        return (React.createElement(Wrapper, null,
            this.props.pageNumber !== 1 ?
                React.createElement(Prev, { onClick: () => this.handlePageNumberClick(this.props.pageNumber - 1) }, "\u25C2") :
                React.createElement("div", null),
            React.createElement(PageNumbers, null,
                first.length > 0 && first.map(this.toPageNumber),
                current.length > 0 && React.createElement("div", null, "\u2026"),
                current.map(this.toPageNumber),
                last.length > 0 && React.createElement("div", null, "\u2026"),
                last.length > 0 && last.map(this.toPageNumber)),
            this.props.pageNumber !== pageCount ?
                React.createElement(Next, { onClick: () => this.handlePageNumberClick(this.props.pageNumber + 1) }, "\u25B8") :
                React.createElement("div", null)));
    }
    getPages(pageCount) {
        let first = [];
        let current = [];
        let last = [];
        if (pageCount < 10) {
            current = getRange(1, pageCount);
        }
        else {
            first = [1];
            last = [pageCount];
            if (this.props.pageNumber < 6) {
                first = getRange(1, 7);
            }
            else if (this.props.pageNumber > pageCount - 6) {
                last = getRange(pageCount - 6, pageCount);
            }
            else {
                current = getRange(this.props.pageNumber - 2, this.props.pageNumber + 2);
            }
        }
        return { first, current, last };
    }
}
exports.default = Pagination;
