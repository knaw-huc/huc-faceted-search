import { AggregationRequest, IFacet, Response } from "./index";
import { IFacetValue } from "../list-facet/value";
export interface IListFacet extends IFacet {
    size: number;
    values: IFacetValue[];
}
export default class ListManger {
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
    updateFacets(response: Response): void;
    private addAggregation;
    private addFacetData;
}
