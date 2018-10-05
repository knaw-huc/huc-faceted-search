import { SortBy, SortDirection, Facets } from '../models/facet';
import ElasticSearchRequest from '../models/elastic-search-request';
import { ElasticSearchResponse } from '../models/elastic-search-response-parser';
export default class IOManager {
    private url;
    private onChange;
    private cache;
    private rangeManager;
    private listManager;
    private query;
    facetCount: number;
    request: ElasticSearchRequest;
    constructor(url: string, onChange: (response: ElasticSearchResponse, facets: Facets) => void);
    addListAggregation(field: string, index: number, size: number): void;
    addListAggregationQuery(field: string, query: string): void;
    addListFilter(field: string, key: string): void;
    removeListFilter(field: string, key: string): void;
    sortListBy(field: string, sortBy: SortBy, direction: SortDirection): void;
    addRangeFacet(field: string, index: number): void;
    addRangeFilter(field: string, min: number, max: number): void;
    addQuery(query: string): void;
    reset(): void;
    setFacetCount(count: number): void;
    viewMoreFacetValues(field: string): void;
    viewLessFacetValues(field: string): void;
    private dispatch;
}
