import FacetManager from '../../../facets-manager';
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
    constructor(facetsManager: FacetManager);
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
