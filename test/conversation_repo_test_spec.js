'use strict';

const assert = require('chai').assert;
const Memstore = require('../components/store/memory_store');
const ConversationRepo = require('../components/repo/conversation_repo');

describe("ConversationRepo Test", function () {
    let convRepo;

    beforeEach(() => {
        let store = new Memstore();
        convRepo = new ConversationRepo(store);
    });

    it("get conversation by id when no conversation with that id", () => {
        let output = convRepo.get(1);
        assert.equal(output, null);
    });

    it("add conversation and get conversation by id", () => {
        let data = {
            "userId": "1",
            "direction": "incoming",
            "message": "hello world!",
            "timestamp": 1234
        };
        let insertData = convRepo.create(data);
        let output = convRepo.get(insertData.id);
        let expectedOutput = {
            "id": 1,
            "userId": "1",
            "direction": "incoming",
            "message": "hello world!",
            "timestamp": 1234
        };
        assert.deepEqual(output, expectedOutput);
    });

    it("remove conversation by id when no conversation with that id", () => {
        let output = convRepo.remove(1);
        assert.equal(output, null);
    });

    it("add conversation and remove conversation by id", () => {
        let data = {
            "userId": "1",
            "direction": "incoming",
            "message": "hello world!",
            "timestamp": 1234
        };
        let insertData = convRepo.create(data);
        let output = convRepo.remove(insertData.id);
        let expectedOutput = {
            "id": 1,
            "userId": "1",
            "direction": "incoming",
            "message": "hello world!",
            "timestamp": 1234
        };
        assert.deepEqual(output, expectedOutput);
    });

    it("list conversation when conversation list is zero", () => {
        let output = convRepo.list(1, 0);
        assert.deepEqual(output, []);
    });

    it("list conversation page 1 only 3 data", () => {
        let data = {
            "userId": "1",
            "direction": "incoming",
            "message": "hello world!",
            "timestamp": 1234
        };
        for (let ii = 0; ii < 10; ii++) {
            convRepo.create(data);
        }
        let output = convRepo.list(1, 3);
        assert.deepEqual(output.length, 3);
    });

    it("list conversation page 2 only 2 data", () => {
        let data = {
            "userId": "1",
            "direction": "incoming",
            "message": "hello world!",
            "timestamp": 1234
        };
        for (let ii = 0; ii < 20; ii++) {
            convRepo.create(data);
        }
        let output = convRepo.list(2, 2);
        assert.equal(output.length, 2);
    });

    it("list conversation page 1 all data", () => {
        let data = {
            "userId": "1",
            "direction": "incoming",
            "message": "hello world!",
            "timestamp": 1234
        };
        for (let ii = 0; ii < 100; ii++) {
            convRepo.create(data);
        }
        let output = convRepo.list(1, 0);
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
        let insertData = convRepo.create(data);
        let output = convRepo.update(insertData.id, updatedData);
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