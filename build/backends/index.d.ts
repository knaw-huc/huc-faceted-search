export declare type BackendType = 'none' | 'elasticsearch';
export declare type Backend = {
    RequestCreator: any;
    ResponseParser: any;
};
export declare type Backends = {
    [key in BackendType]: Backend;
};
declare const _default: Backends;
export default _default;
