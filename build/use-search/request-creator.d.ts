export default class ESRequest {
    _source: {
        include?: AppProps['resultFields'];
        exclude?: AppProps['excludeResultFields'];
    };
    from: number;
    size: number;
    sort: any;
    constructor(options: ElasticSearchRequestOptions);
    private setSource;
}
