'use strict';

const assert = require('chai').assert;
const Memstore = require('../components/store/memory_store');
const GenericRepo = require('../components/repo/generic_repo');

describe("GenericRepo Test", function () {
    let genericRepo;

    beforeEach(() => {
        let store = new Memstore();
        let options = {};
        genericRepo = new GenericRepo(options, store);
    });

    it("get data by id when no data with that id", () => {
        let output = genericRepo.get(1);
        assert.equal(output, null);
    });

    it("add data and get data by id", () => {
        let data = {
            "userId": "1",
            "direction": "incoming",
            "message": "hello world!",
            "timestamp": 1234
        };
        let insertData = genericRepo.create(data);
        let output = genericRepo.get(insertData.id);
        let expectedOutput = {
            "id": 1,
            "userId": "1",
            "direction": "incoming",
            "message": "hello world!",
            "timestamp": 1234
        };
        assert.deepEqual(output, expectedOutput);
    });

    it("remove data by id when no data with that id", () => {
        let output = genericRepo.remove(1);
        assert.equal(output, null);
    });

    it("add data and remove data by id", () => {
        let data = {
            "userId": "1",
            "direction": "incoming",
            "message": "hello world!",
            "timestamp": 1234
        };
        let insertData = genericRepo.create(data);
        let output = genericRepo.remove(insertData.id);
        let expectedOutput = {
            "id": 1,
            "userId": "1",
            "direction": "incoming",
            "message": "hello world!",
            "timestamp": 1234
        };
        assert.deepEqual(output, expectedOutput);
    });

    it("list data when data list is zero", () => {
        let output = genericRepo.list(1, 0);
        assert.deepEqual(output, []);
    });

    it("list data page 1 only 3 data", () => {
        let data = {
            "userId": "1",
            "direction": "incoming",
            "message": "hello world!",
            "timestamp": 1234
        };
        for (let ii = 0; ii < 10; ii++) {
            genericRepo.create(data);
        }
        let output = genericRepo.list(1, 3);
        assert.deepEqual(output.length, 3);
    });

    it("list data page 2 only 2 data", () => {
        let data = {
            "userId": "1",
            "direction": "incoming",
            "message": "hello world!",
            "timestamp": 1234
        };
        for (let ii = 0; ii < 20; ii++) {
            genericRepo.create(data);
        }
        let output = genericRepo.list(2, 2);
        assert.equal(output.length, 2);
    });

    it("list data page 1 all data", () => {
        let data = {
            "userId": "1",
            "direction": "incoming",
            "message": "hello world!",
            "timestamp": 1234
        };
        for (let ii = 0; ii < 100; ii++) {
            genericRepo.create(data);
        }
        let output = genericRepo.list(1, 0);
        assert.equal(output.length, 100);
    });

    it("update data", () => {
        let data = {
            "userId": "1",
            "direction": "incoming",
            "message": "hello world!",
            "timestamp": 1234
        };
        let updatedData = {
            "direction": "outgoing",
            "message": "test test"
        };
        let insertData = genericRepo.create(data);
        let output = genericRepo.update(insertData.id, updatedData);
        let expectedOutput = {
            "userId": "1",
            "direction": "outgoing",
            "message": "test test",
            "timestamp": 1234,
            "id": 1
        };
        assert.deepEqual(output, expectedOutput);
    });
});