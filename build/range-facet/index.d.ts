import * as React from 'react';
import { FacetsProps } from '../facets';
interface Props {
    field: string;
    title: string;
}
interface State {
    lowerLimit: number;
    rangeMin: number;
    rangeMax: number;
    upperLimit: number;
}
export default class RangeFacetView extends React.PureComponent<Props & FacetsProps, State> {
    state: State;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
