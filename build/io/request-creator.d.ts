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
    _source: {
        include?: AppProps['resultFields'];
        exclude?: AppProps['excludeResultFields'];
    };
    aggs: Aggregations;
    from: number;
    highlight: Highlight;
    post_filter: Record<string, any>;
    query: Record<string, any>;
    size: number;
    sort: any;
    constructor(options: ElasticSearchRequestOptions);
    private setPostFilter;
    private setAggregations;
    private addFilter;
    private addHierarchyFilter;
    private createBooleanAggregation;
    private tmp;
    private createHierarchyAggregation;
    private createListAggregation;
    private createHistogramAggregation;
    private createDateHistogramAggregation;
    private setQuery;
    private setSource;
}
export {};
