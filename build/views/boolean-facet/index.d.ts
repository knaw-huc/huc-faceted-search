import * as React from 'react';
import { FacetsProps } from '../facets';
export default class BooleanFacet extends React.PureComponent<FacetsProps & BooleanFacetProps> {
    static defaultProps: Partial<BooleanFacetProps>;
    componentDidMount(): void;
    render(): JSX.Element;
}
