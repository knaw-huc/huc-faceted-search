import * as React from 'react';
interface Props {
    goToPage: (pageNumber: number) => void;
    resultsPerPage: number;
    searchResults: SearchResults;
}
interface State {
    pageNumber: number;
}
export default class Pagination extends React.PureComponent<Props, State> {
    state: State;
    componentDidUpdate(prevProps: Props): void;
    render(): JSX.Element;
    private getPages;
    private toPageNumber;
    private handlePageNumberClick;
}
export {};
