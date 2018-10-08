import { Facets } from "../models/facet"

export class NoneRequestCreator {
	constructor(public facets: Facets, public query: string) {}
}

export class NoneResponseParser {
	constructor(public facets: Facets, public query: string) {}
}