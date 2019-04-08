import * as React from 'react';
import { FacetsProps } from '../facets';
export default class RangeFacetView extends React.PureComponent<RangeProps & FacetsProps, RangeState> {
    state: RangeState;
    static defaultProps: Partial<RangeProps>;
    componentDidMount(): void;
    componentDidUpdate(prevProps: RangeProps & FacetsProps): void;
    render(): JSX.Element;
    private formatRange;
    private formatDate;
}
