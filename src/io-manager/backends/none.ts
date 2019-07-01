export class NoneRequestCreator {
	constructor(public facets: Facets, public query: string) {}
}

export function noneResponseParser(response: any) {
	return response
}
