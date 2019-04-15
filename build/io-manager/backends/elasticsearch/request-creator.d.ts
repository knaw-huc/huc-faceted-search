import FacetManager from '../../../facets-manager';
interface AggregationRequest {
    aggs: any;
    filter?: any;
}
declare type Aggregations = {
    [id: string]: AggregationRequest;
};
export default class ElasticSearchRequest {
    size: number;
    aggs: Aggregations;
    highlight: {
        fields: {
            text: {};
        };
        require_field_match: boolean;
    };
    post_filter: any;
    query: any;
    constructor(facetsManager: FacetManager, size: number);
    private setQuery;
    private setAggregations;
    private setPostFilter;
    private addFilter;
    private createBooleanAggregation;
    private createListAggregation;
    private createRangeAggregation;
    private createHistogramAggregation;
}
export {};
