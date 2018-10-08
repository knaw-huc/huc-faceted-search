import * as React from 'react';
import { ListFacetProps, ListFacetState } from './index';
import { FacetsProps } from '../facets';
import { ListFacetValue } from '../../models/facet';
declare type Props = FacetsProps & ListFacetProps & ListFacetState;
interface State {
    values: ListFacetValue[];
}
export default class FacetValuesView extends React.PureComponent<Props, State> {
    private wrapperRef;
    private listHeight;
    state: State;
    constructor(props: Props);
    static getDerivedStateFromProps(props: Props): {
        values: ListFacetValue[] | [number, number];
    };
    componentDidUpdate(prevProps: Props, prevState: State): void;
    render(): JSX.Element;
    private animate;
    private setHeight;
}
export {};
