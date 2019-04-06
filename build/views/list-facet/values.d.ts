import * as React from 'react';
import { ListFacet } from '../../models/facet';
import { ContextState } from '../../context';
export declare type Props = {
    collapsed: boolean;
    facet: ListFacet;
    field: string;
    state: ContextState;
};
export default class FacetValuesView extends React.PureComponent<Props> {
    private wrapperRef;
    private listHeight;
    componentDidUpdate(prevProps: Props): void;
    render(): JSX.Element;
    private animate;
    private setHeight;
}
