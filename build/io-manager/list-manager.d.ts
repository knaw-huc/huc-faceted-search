import { ListFacet, SortDirection, SortBy } from '../models/facet';
import FacetManager from './facet-manager';
export default class ListFacetManager extends FacetManager<ListFacet> {
    addFacet(field: string, index: number, size: number): void;
    addFilter(field: string, key: string): void;
    removeFilter(field: string, key: string): void;
    addQuery(field: string, query: string): void;
    sortBy(field: string, sortBy: SortBy, direction: SortDirection): void;
    reset(): void;
    viewLess(field: string): void;
    viewMore(field: string): void;
}
