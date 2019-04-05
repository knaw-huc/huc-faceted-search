/// <reference path="../../src/search-results/types.d.ts" />
import * as React from 'react';
interface Props {
    onClickResult?: (result: any, ev: React.MouseEvent<HTMLLIElement>) => void;
    resultBodyComponent: React.SFC<ResultBodyProps>;
    searchResults: SearchResults;
}
export default class HucSearchResults extends React.PureComponent<Props> {
    static defaultProps: Pick<Props, 'searchResults'>;
    render(): JSX.Element;
}
export {};
