import { Facets } from './models/facet';
declare type DispatchResponse = {
    request: any;
    response: any;
    facets: Facets;
};
interface Options {
    backend: 'none' | 'elasticsearch';
    url: string;
}
export default class IOManager {
    private options;
    private backend;
    private cache;
    private history;
    constructor(options: Options);
    dispatch(facets: Facets, query: string): Promise<DispatchResponse>;
    handleFetch(request: any, facets: Facets, query: string): Promise<{
        facets: any;
        request: any;
        response: any;
    }>;
    fetch(body: any): Promise<any>;
    getNext(): Promise<{
        query: string;
        facets: any;
        request: any;
        response: any;
    }>;
}
export {};
