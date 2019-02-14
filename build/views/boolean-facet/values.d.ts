import * as React from 'react';
import { BooleanFacetProps } from './index';
import { FacetsProps } from '../facets';
import { ListFacetValue } from '../../models/facet';
export declare type Props = FacetsProps & BooleanFacetProps;
interface State {
    values: ListFacetValue[];
}
export default class FacetValuesView extends React.PureComponent<Props, State> {
    state: State;
    static getDerivedStateFromProps(props: Props): {
        values: [number, number] | ListFacetValue[];
    };
    render(): JSX.Element;
}
export {};
