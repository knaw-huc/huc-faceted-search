import { Facets } from "../models/facet";
export declare class NoneRequestCreator {
    facets: Facets;
    query: string;
    constructor(facets: Facets, query: string);
}
export declare class NoneResponseParser {
    facets: Facets;
    query: string;
    constructor(facets: Facets, query: string);
}
