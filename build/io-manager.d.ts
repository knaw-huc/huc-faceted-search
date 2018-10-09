import { Facets } from './models/facet';
declare type DispatchResponse = {
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
    requestBody: any;
    constructor(options: Options);
    dispatch(facets: Facets, query: string): Promise<DispatchResponse>;
    fetch(body: any): Promise<any>;
}
export {};
