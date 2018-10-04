import * as React from 'react';
import { FacetsProps } from '../facets';
interface Props {
    field: string;
    id: string;
    title: string;
}
interface State {
    lowerLimit: number;
    rangeMin: number;
    rangeMax: number;
    upperLimit: number;
}
export default class RangeFacet extends React.PureComponent<Props & FacetsProps, State> {
    state: State;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
