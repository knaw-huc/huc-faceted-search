import * as React from 'react';
import { IFacetValue } from './value';
import { ListFacetProps, ListFacetState } from './index';
import { FacetsProps } from '../facets';
declare type Props = FacetsProps & ListFacetProps & ListFacetState;
interface State {
    values: IFacetValue[];
}
export default class FacetValues extends React.PureComponent<Props, State> {
    private wrapperRef;
    private listHeight;
    state: State;
    constructor(props: Props);
    static getDerivedStateFromProps(props: Props): {
        values: IFacetValue[] | [number, number];
    };
    componentDidUpdate(prevProps: Props, prevState: State): void;
    render(): JSX.Element;
    private animate;
    private setHeight;
}
export {};
