import * as React from 'react';
import { FacetsProps } from '../facets';
export interface BooleanFacetProps {
    field: string;
    labels?: [string, string];
    title: string;
}
export default class BooleanFacet extends React.PureComponent<FacetsProps & BooleanFacetProps> {
    static defaultProps: Partial<BooleanFacetProps>;
    componentDidMount(): void;
    render(): JSX.Element;
}
