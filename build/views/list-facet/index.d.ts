import * as React from 'react';
import { FacetsProps } from '../facets';
export interface ListFacetProps {
    field: string;
    size?: number;
    title: string;
}
export interface ListFacetState {
    collapsed: boolean;
    options: boolean;
}
export default class ListFacet extends React.PureComponent<FacetsProps & ListFacetProps, ListFacetState> {
    state: ListFacetState;
    static defaultProps: Partial<ListFacetProps>;
    componentDidMount(): void;
    render(): JSX.Element;
}
