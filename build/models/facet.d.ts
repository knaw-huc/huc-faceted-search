export declare enum FacetType {
    List = 0,
    Range = 1
}
export declare enum SortBy {
    Count = "_count",
    Key = "_term"
}
export declare enum SortDirection {
    Asc = "asc",
    Desc = "desc"
}
export declare class Facet {
    field: string;
    index: number;
    type: FacetType;
    id: string;
    constructor(field: string, index: number, type: FacetType);
}
export interface ListFacetValue {
    key: string;
    doc_count: number;
}
export declare class ListFacet extends Facet {
    size: number;
    filters: Set<string>;
    order: [SortBy, SortDirection];
    query: string;
    values: ListFacetValue[];
    viewSize: number;
    constructor(field: string, index: number, size: number);
    viewLess(): void;
    viewMore(): void;
}
export declare class RangeFacet extends Facet {
    filter: [number, number];
    histogramValues: any[];
    values: [number, number];
    constructor(field: string, index: number);
}
export declare type Facets = {
    [id: string]: ListFacet | RangeFacet;
};
