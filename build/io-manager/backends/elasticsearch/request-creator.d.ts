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
    post_filter: Record<string, any>;
    query: Record<string, any>;
    _source: IOOptions['resultFields'];
    constructor(facets: Facet[], facetsManagerQuery: string, size: number, resultFields: IOOptions['resultFields']);
    private setSource;
    private setQuery;
    private setAggregations;
    private setPostFilter;
    private addFilter;
    private createBooleanAggregation;
    private createListAggregation;
    private createHistogramAggregation;
}
export {};
