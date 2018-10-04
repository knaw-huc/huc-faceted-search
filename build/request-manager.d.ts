import { IFacetValue } from './list-facet/value';
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
export interface IListFacet extends IFacet {
    size: number;
    values: IFacetValue[];
}
export interface IRangeFacet extends IFacet {
    values: [number, number];
}
export declare type IFacets = {
    [id: string]: IListFacet | IRangeFacet;
};
export default class RequestManager {
    private url;
    private onChange;
    private facets;
    private cache;
    private request;
    private listFilters;
    private rangeFilters;
    facetCount: number;
    constructor(url: string, onChange: (response: Response, facets: IFacets) => void);
    addListAggregation(id: string, field: string, size: number): void;
    addRangeAggregation(id: string, field: string): void;
    addListFilter(field: string, key: string): void;
    addRangeFilter(field: string, min: number, max: number): void;
    addQuery(query: string): void;
    removeListFilter(field: string, key: string): void;
    setFacetCount(count: number): void;
    viewMoreFacetValues(id: string, field: string, size: number): void;
    viewLessFacetValues(id: string, field: string, size: number): void;
    private dispatch;
    private setFilters;
    private getValues;
    private updateFacets;
}
export {};
