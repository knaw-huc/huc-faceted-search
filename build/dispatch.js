"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const backends_1 = require("./backends");
class IOManager {
    constructor(options) {
        this.options = options;
        this.cache = {};
        this.backend = backends_1.default[options.backend];
    }
    dispatch(facets, query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.requestBody = new this.backend.RequestCreator(facets, query);
            const body = JSON.stringify(this.requestBody);
            let response;
            if (this.cache.hasOwnProperty(body)) {
                response = JSON.parse(this.cache[body]);
            }
            else {
                response = yield this.fetch(body);
                this.cache[body] = JSON.stringify(response);
            }
            const responseParser = new this.backend.ResponseParser(response, facets);
            return {
                facets: responseParser.facets,
                response
            };
        });
    }
    fetch(body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let fetchResponse;
            let response;
            try {
                fetchResponse = yield fetch(this.options.url, {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    body
                });
                response = yield fetchResponse.json();
            }
            catch (err) {
                throw ('Failed to fetched Faceted Search state');
            }
            return fetchResponse.status === 200 ? response : null;
        });
    }
}
exports.default = IOManager;
