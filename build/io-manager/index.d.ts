import RangeManager from './range-manager';
import ListFacetManager from './list-manager';
import { Facets } from '../models/facet';
import ElasticSearchRequest from '../models/elastic-search-request';
import { ElasticSearchResponse } from '../models/elastic-search-response-parser';
export default class IOManager {
    private url;
    private onChange;
    private cache;
    private query;
    facetCount: number;
    listManager: ListFacetManager;
    rangeManager: RangeManager;
    request: ElasticSearchRequest;
    constructor(url: string, onChange: (response: ElasticSearchResponse, facets: Facets) => void);
    addQuery(query: string): void;
    reset(): void;
    setFacetCount(count: number): void;
    private dispatch;
}
