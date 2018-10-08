import RangeManager from './range-manager';
import ListFacetManager from './list-manager';
import { Facets } from '../models/facet';
import ElasticSearchRequest from '../models/elastic-search-request';
export default class FacetsManager {
    private onChange;
    private query;
    facetCount: number;
    listManager: ListFacetManager;
    rangeManager: RangeManager;
    request: ElasticSearchRequest;
    constructor(onChange: (facets: Facets, query: string) => void);
    private handleChange;
    addQuery(query: string): void;
    reset(): void;
    setFacetCount(count: number): void;
}
