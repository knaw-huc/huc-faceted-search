import FacetsManager from './facets-manager';
declare type DispatchResponse = {
    request: any;
    response: any;
};
interface Options {
    backend: 'none' | 'elasticsearch';
    url: string;
}
export default class IOManager {
    private options;
    private facetsManager;
    private backend;
    private cache;
    private history;
    constructor(options: Options, facetsManager: FacetsManager);
    dispatch(): Promise<DispatchResponse>;
    handleFetch(request: any): Promise<{
        request: any;
        response: any;
    }>;
    private fetch;
    getNext(): Promise<{
        query: string;
        request: any;
        response: any;
    }>;
}
export {};
