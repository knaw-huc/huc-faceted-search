/// <reference path="../../src/search-results/types.d.ts" />
import * as React from 'react';
import { ContextState } from '../context';
interface Props {
    goToPage: (pageNumber: number) => void;
    onClickResult: (result: any, ev: React.MouseEvent<HTMLLIElement>) => void;
    pageNumber: number;
    resultBodyComponent: React.SFC<ResultBodyProps>;
    resultBodyProps: Record<string, any>;
    resultsPerPage: number;
    state: ContextState;
}
export default class HucSearchResults extends React.PureComponent<Props> {
    render(): JSX.Element;
}
export {};
