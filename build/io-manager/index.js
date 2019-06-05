"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const backends_1 = tslib_1.__importDefault(require("./backends"));
class IOManager {
    constructor(options, facetsManager) {
        this.options = options;
        this.facetsManager = facetsManager;
        this.cache = {};
        this.hitsCache = {};
        this.currentPage = 1;
        this.goToPage = (pageNumber) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.lastRequest == null)
                return;
            this.currentPage = pageNumber;
            const body = this.lastRequest;
            body.from = body.size * (pageNumber - 1);
            const response = yield this.handleFetch(body);
            this.onChange(response);
        });
        this.backend = backends_1.default[options.backend];
        this.facetsManager.onChange = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const requestBody = new this.backend.RequestCreator(this.facetsManager, this.options.resultsPerPage);
            const response = yield this.handleFetch(requestBody);
            this.onChange(response);
        });
    }
    handleFetch(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let response;
            const body = JSON.stringify(request);
            if (this.cache.hasOwnProperty(body)) {
                response = JSON.parse(this.cache[body]);
            }
            else {
                this.lastRequest = request;
                const fetchResponse = yield this.fetch(body);
                const responseParser = new this.backend.ResponseParser(fetchResponse, this.facetsManager);
                response = responseParser.parsedResponse;
                this.cache[body] = JSON.stringify(response);
                this.updateHitsCache(request, response.hits);
            }
            return {
                request,
                response,
                query: this.facetsManager.query
            };
        });
    }
    updateHitsCache(request, hits) {
        let { from } = request, rest = tslib_1.__rest(request, ["from"]);
        const hitsKey = JSON.stringify(rest);
        if (from == null)
            from = 0;
        const arr = this.hitsCache[hitsKey] || [];
        hits.forEach((hit, index) => {
            arr[from + index] = hit;
        });
        this.hitsCache[hitsKey] = arr;
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
    getPrevNext(id) {
        if (this.lastRequest == null)
            return;
        const _a = this.lastRequest, { from } = _a, rest = tslib_1.__rest(_a, ["from"]);
        const hits = this.hitsCache[JSON.stringify(rest)];
        const index = hits.findIndex(hit => hit.id === id);
        console.log(index);
        return [hits[index - 1], hits[index + 1]];
    }
}
exports.default = IOManager;
