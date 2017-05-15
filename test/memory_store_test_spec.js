'use strict';

const assert = require('chai').assert;
const Memstore = require('../components/store/memory_store');

describe("Memstore Test", function () {
    let store;

    before(() => {
        store = new Memstore();
    });

    it("is initialized", () => {
        assert.deepEqual(store.store, store.get());
    });
});