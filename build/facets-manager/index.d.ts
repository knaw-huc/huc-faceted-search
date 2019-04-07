import { Facets, FacetType, SortBy, SortDirection } from '../models/facet';
import FacetGetters from './getters';
export default class FacetsManager extends FacetGetters {
    private onChange;
    query: string;
    facetCount: number;
    constructor(onChange: (facets: Facets, query: string) => void);
    addFacet(type: FacetType, field: string, index: number, thirdArg?: any): void;
    addFilter(field: string, key: string): void;
    addFilter(field: string, key: number, max: number): void;
    removeFilter(field: string, key: string): void;
    sortListBy(field: string, sortBy: SortBy, direction: SortDirection): void;
    addListFilterQuery(field: string, query: string): void;
    viewLess(field: string): void;
    viewMore(field: string): void;
    addQuery(query: string): void;
    reset(): void;
    setFacetCount(count: number): void;
    private handleChange;
}
