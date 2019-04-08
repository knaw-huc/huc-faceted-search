export declare type Backend = {
    RequestCreator: any;
    ResponseParser: any;
};
declare const backends: Record<BackendType, Backend>;
export default backends;
