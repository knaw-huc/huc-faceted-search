import { Facets } from '../../models/facet';
interface AggregationRequest {
    aggs: any;
    filter: any;
}
declare type Aggregations = {
    [id: string]: AggregationRequest;
};
export default class ElasticSearchRequest {
    aggs: Aggregations;
    post_filter: any;
    query: any;
    size: number;
    sort: string;
    constructor(facets?: Facets, query?: string);
    private createListAggregation;
    private createRangeAggregation;
    private createHistogramAggregation;
    private setPostFilter;
}
export {};
