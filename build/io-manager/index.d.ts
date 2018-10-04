import { IRangeFacet } from './range-manager';
import { IListFacet, SortBy, SortDirection } from './list-manager';
export declare class Request {
    aggs: {
        [id: string]: AggregationRequest;
    };
    post_filter: any;
    query: any;
    size: number;
    sort: string;
}
interface Hit {
    _source: any;
}
export interface Response {
    aggregations: {
        [id: string]: any;
    };
    hits: {
        hits: Hit[];
        total: number;
    };
}
export interface AggregationRequest {
    aggs: any;
    filter: any;
}
export declare enum FacetType {
    List = 0,
    Range = 1
}
export interface IFacet {
    field: string;
    type: FacetType;
}
export declare type IFacets = {
    [id: string]: IListFacet | IRangeFacet;
};
export default class IOManager {
    private url;
    private onChange;
    private cache;
    private rangeManager;
    private listManager;
    facetCount: number;
    request: Request;
    constructor(url: string, onChange: (response: Response, facets: IFacets) => void);
    addListAggregation(id: string, field: string, size: number): void;
    addListAggregationQuery(id: string, field: string, query: string): void;
    addListFilter(field: string, key: string): void;
    removeListFilter(field: string, key: string): void;
    sortListBy(id: string, field: string, sortBy: SortBy, direction: SortDirection): void;
    addRangeFacet(id: string, field: string): void;
    addRangeFilter(field: string, min: number, max: number): void;
    addQuery(query: string): void;
    reset(): void;
    setFacetCount(count: number): void;
    viewMoreFacetValues(id: string, field: string, size: number): void;
    viewLessFacetValues(id: string, field: string, size: number): void;
    private dispatch;
    private prepareFilters;
    private setFilters;
}
export {};
