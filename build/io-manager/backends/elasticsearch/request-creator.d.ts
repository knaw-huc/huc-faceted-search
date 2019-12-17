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
    post_filter: Record<string, any>;
    query: Record<string, any>;
    _source: AppProps['resultFields'];
    constructor(fields: FacetConfig[], resultFields: AppProps['resultFields'], filters: Filters, sorts: Sorts);
    private setSource;
    private setAggregations;
    private setPostFilter;
    private addFilter;
    private createBooleanAggregation;
    private createListAggregation;
    private createHistogramAggregation;
}
export {};
