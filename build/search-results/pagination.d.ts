import * as React from 'react';
interface Props {
    goToPage: (pageNumber: number) => void;
    pageNumber: number;
    resultsPerPage: number;
    searchResults: SearchResults;
}
export default class Pagination extends React.PureComponent<Props> {
    componentDidUpdate(prevProps: Props): void;
    render(): JSX.Element;
    private getPages;
    private toPageNumber;
    private handlePageNumberClick;
}
export {};
