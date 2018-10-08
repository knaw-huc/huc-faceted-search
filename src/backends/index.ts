import ElasticSearchRequest from "../models/elastic-search-request";
import ElasticSearchResponseParser from "../models/elastic-search-response-parser";
import { NoneRequestCreator, NoneResponseParser } from './none'

export type BackendType = 'none' | 'elasticsearch'
export type Backend = {
	RequestCreator: any
	ResponseParser: any
}
export type Backends = {
	[key in BackendType]: Backend
}

export default {
	none: {
		RequestCreator: NoneRequestCreator,
		ResponseParser: NoneResponseParser,
	},
	elasticsearch: {
		RequestCreator: ElasticSearchRequest,
		ResponseParser: ElasticSearchResponseParser,
	}

} as Backends