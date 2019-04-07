import * as React from 'react';
import FacetsView from './views/facets';
import ListFacet from './views/list-facet';
import RangeFacet from './views/range-facet';
import BooleanFacet from './views/boolean-facet';
import FullTextSearch from './views/full-text-search';
import { ContextState } from './context';
import Reset from './views/reset';
import { BackendType } from './backends';
import SearchResults from './search-results';
export { BooleanFacet, FacetsView as Facets, FullTextSearch, ListFacet, RangeFacet, Reset, SearchResults };
interface Props {
    backend?: BackendType;
    onChange: (request: any, response: any, query: string) => void;
    url: string;
}
export default class FacetedSearch extends React.PureComponent<Props, ContextState> {
    state: ContextState;
    private ioManager;
    private facetsManager;
    static defaultProps: Partial<Props>;
    constructor(props: Props);
    render(): JSX.Element;
    addFilter(field: string, key: string): void;
    getNext(): Promise<void>;
    private handleChange;
    private update;
}
