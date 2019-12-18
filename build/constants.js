"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
exports.SPOT_COLOR = '#08c';
function fetchSearchResults(url, request) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let fetchResponse;
        let response;
        try {
            fetchResponse = yield fetch(url, {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request)
            });
            response = yield fetchResponse.json();
        }
        catch (err) {
            throw ('Failed to fetched Faceted Search state');
        }
        return fetchResponse.status === 200 ? response : null;
    });
}
exports.fetchSearchResults = fetchSearchResults;
