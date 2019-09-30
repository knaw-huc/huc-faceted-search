import * as React from 'react';
import { BooleanFacet } from '../../models/facet';
import { ContextState } from '../../context';
export interface Props {
    facet: BooleanFacet;
    field: string;
    labels: {
        true: string;
        false: string;
    };
    state: ContextState;
}
export default class BooleanFacetValuesView extends React.PureComponent<Props> {
    render(): JSX.Element;
}
