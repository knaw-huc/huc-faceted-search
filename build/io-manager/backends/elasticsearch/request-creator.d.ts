interface AggregationRequest {
    aggs: any;
    filter?: any;
}
declare type Aggregations = {
    [id: string]: AggregationRequest;
};
declare type Highlight = {
    fields: {
        text: {};
    };
    require_field_match: boolean;
};
export default class ElasticSearchRequest {
    aggs: Aggregations;
    highlight: Highlight;
    post_filter: Record<string, any>;
    query: Record<string, any>;
    _source: AppProps['resultFields'];
    constructor(options: ElasticSearchRequestOptions);
    private setPostFilter;
    private setAggregations;
    private addFilter;
    private createBooleanAggregation;
    private createListAggregation;
    private createHistogramAggregation;
    private setQuery;
    private setSource;
}
export {};
