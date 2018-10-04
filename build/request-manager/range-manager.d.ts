import { AggregationRequest, IFacet, Response } from "./index";
export interface IRangeFacet extends IFacet {
    values: [number, number];
}
interface IRangeFilter {
    range: {
        [key: string]: {
            gte: number;
            lte: number;
        };
    };
}
export default class RangeManger {
    aggregations: {
        [key: string]: AggregationRequest;
    };
    facets: {
        [key: string]: IRangeFacet;
    };
    filters: IRangeFilter[];
    addFacet(id: string, field: string): void;
    addFilter(field: string, min: number, max: number): void;
    updateFacets(response: Response): void;
    private addAggregation;
    private addFacetData;
}
export {};
