import { Facets } from '../../models/facet';
interface AggregationRequest {
    aggs: any;
    filter?: any;
}
declare type Aggregations = {
    [id: string]: AggregationRequest;
};
export default class ElasticSearchRequest {
    aggs: Aggregations;
    highlight: {
        fields: {
            text: {};
        };
        require_field_match: boolean;
    };
    post_filter: any;
    query: any;
    size: number;
    constructor(facets?: Facets, query?: string);
    private createBooleanAggregation;
    private addFilter;
    private createListAggregation;
    private createRangeAggregation;
    private createHistogramAggregation;
    private setAggs;
    private setPostFilter;
}
export {};
