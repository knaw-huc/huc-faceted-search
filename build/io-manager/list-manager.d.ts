import { AggregationRequest, IFacet, Response } from "./index";
import { IFacetValue } from "../list-facet/value";
export declare enum SortBy {
    Count = "_count",
    Key = "_term"
}
export declare enum SortDirection {
    Asc = "asc",
    Desc = "desc"
}
export interface IListFacet extends IFacet {
    size: number;
    values: IFacetValue[];
}
export default class ListManager {
    aggregations: {
        [key: string]: AggregationRequest;
    };
    facets: {
        [key: string]: IListFacet;
    };
    filters: any[];
    addFacet(id: string, field: string, size: number): void;
    addFilter(field: string, key: string): void;
    removeFilter(field: string, key: string): void;
    reset(): void;
    addQuery(id: string, field: string, query: string): void;
    sortBy(id: string, field: string, sortBy: SortBy, direction: SortDirection): void;
    updateFacets(response: Response): void;
    private addAggregation;
    private addFacetData;
}
