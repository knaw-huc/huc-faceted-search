import * as React from 'react';
import Facets from './facets';
import ListFacet from './list-facet';
import RangeFacet from './range-facet';
import FullTextSearch from './full-text-search';
import { ContextState } from './context';
import { Request, Response } from './io-manager';
import Reset from './reset';
export { Facets, FullTextSearch, ListFacet, RangeFacet, Reset, };
interface Props {
    onChange: (request: Request, response: Response) => void;
    url: string;
}
export default class FacetedSearch extends React.PureComponent<Props, ContextState> {
    private handleChange;
    state: ContextState;
    render(): JSX.Element;
}
