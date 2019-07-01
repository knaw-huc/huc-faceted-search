import FacetGetters from './getters';
export default class FacetManager extends FacetGetters {
    addFilter(field: string, key: string): void;
    addFilter(field: string, key: number, max: number): void;
    removeFilter(field: string, key: string): void;
    addQuery(query: string): void;
    sortListBy(field: string, sortBy: SortBy, direction: SortDirection): void;
    addListFilterQuery(field: string, query: string): void;
    viewLess(field: string): void;
    viewMore(field: string): void;
    reset(): void;
    setFacetCount(count: number): void;
    update(response: FSResponse): void;
}
