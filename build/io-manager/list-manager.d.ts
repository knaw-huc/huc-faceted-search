import { ListFacet, SortDirection, SortBy } from '../models/facet';
export default class ListFacetManager {
    facets: {
        [field: string]: ListFacet;
    };
    addFacet(field: string, index: number, size: number): void;
    addFilter(field: string, key: string): void;
    removeFilter(field: string, key: string): void;
    reset(): void;
    addQuery(field: string, query: string): void;
    sortBy(field: string, sortBy: SortBy, direction: SortDirection): void;
}
