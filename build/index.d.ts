import * as React from 'react';
import FacetsView from './views/facets';
import ListFacet from './views/list-facet';
import RangeFacetView from './views/range-facet';
import FullTextSearch from './views/full-text-search';
import { ContextState } from './context';
import Reset from './views/reset';
import ElasticSearchRequest from './models/elastic-search-request';
import { ElasticSearchResponse } from './models/elastic-search-response-parser';
export { FacetsView as Facets, FullTextSearch, ListFacet, RangeFacetView as RangeFacet, Reset, };
interface Props {
    onChange: (request: ElasticSearchRequest, response: ElasticSearchResponse) => void;
    url: string;
}
export default class FacetedSearch extends React.PureComponent<Props, ContextState> {
    private handleChange;
    state: ContextState;
    render(): JSX.Element;
}
