import * as React from 'react';
import { FacetsProps } from '../facets';
interface Props {
    field: string;
    granularity: 'year' | 'month' | 'day';
    title: string;
    type?: 'number' | 'timestamp';
}
interface State {
    lowerLimit: number;
    rangeMin: number;
    rangeMax: number;
    upperLimit: number;
}
export default class RangeFacetView extends React.PureComponent<Props & FacetsProps, State> {
    state: State;
    static defaultProps: Partial<Props>;
    componentDidMount(): void;
    componentDidUpdate(prevProps: Props & FacetsProps): void;
    render(): JSX.Element;
    formatNumber(num: number): string | number;
}
export {};
