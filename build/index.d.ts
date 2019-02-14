import * as React from 'react';
import FacetsView from './views/facets';
import ListFacet from './views/list-facet';
import RangeFacetView from './views/range-facet';
import FullTextSearch from './views/full-text-search';
import { ContextState } from './context';
import Reset from './views/reset';
import { BackendType } from './backends';
export { FacetsView as Facets, FullTextSearch, ListFacet, RangeFacetView as RangeFacet, Reset, };
interface Props {
    backend?: BackendType;
    onChange: (request: any, response: any, query: string) => void;
    url: string;
}
export default class FacetedSearch extends React.PureComponent<Props, ContextState> {
    state: ContextState;
    private ioManager;
    static defaultProps: Partial<Props>;
    constructor(props: Props);
    render(): JSX.Element;
    private handleChange;
}
