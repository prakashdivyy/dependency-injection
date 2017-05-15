'use strict';

const assert = require('chai').assert;
const Memstore = require('../components/store/memory_store');
const UserRepo = require('../components/repo/user_repo');

describe("UserRepo Test", function () {
    let userRepo;

    beforeEach(() => {
        let store = new Memstore();
        userRepo = new UserRepo(store);
    });

    it("get user by id when no user with that id", () => {
        let output = userRepo.get(1);
        assert.equal(output, null);
    });

    it("add user and get user by id", () => {
        let data = {
            "name": "master",
            "gender": "male",
            "city": "jakarta",
            "phone": "123456789",
            "email": "email@master.com",
        };
        let insertData = userRepo.create(data);
        let output = userRepo.get(insertData.id);
        let expectedOutput = {
            "id": 1,
            "name": "master",
            "gender": "male",
            "city": "jakarta",
            "phone": "123456789",
            "email": "email@master.com",
        };
        assert.deepEqual(output, expectedOutput);
    });

    it("remove user by id when no user with that id", () => {
        let output = userRepo.remove(1);
        assert.equal(output, null);
    });

    it("add user and remove user by id", () => {
        let data = {
            "name": "master",
            "gender": "male",
            "city": "jakarta",
            "phone": "123456789",
            "email": "email@master.com",
        };
        let insertData = userRepo.create(data);
        let output = userRepo.remove(insertData.id);
        let expectedOutput = {
            "id": 1,
            "name": "master",
            "gender": "male",
            "city": "jakarta",
            "phone": "123456789",
            "email": "email@master.com",
        };
        assert.deepEqual(output, expectedOutput);
    });

    it("list user when user list is zero", () => {
        let output = userRepo.list(1, 0);
        assert.deepEqual(output, []);
    });

    it("list user page 1 only 3 data", () => {
        let data = {
            "name": "master",
            "gender": "male",
            "city": "jakarta",
            "phone": "123456789",
            "email": "email@master.com",
        };
        for (let ii = 0; ii < 10; ii++) {
            userRepo.create(data);
        }
        let output = userRepo.list(1, 3);
        assert.deepEqual(output.length, 3);
    });

    it("list user page 2 only 2 data", () => {
        let data = {
            "name": "master",
            "gender": "male",
            "city": "jakarta",
            "phone": "123456789",
            "email": "email@master.com",
        };
        for (let ii = 0; ii < 20; ii++) {
            userRepo.create(data);
        }
        let output = userRepo.list(2, 2);
        assert.equal(output.length, 2);
    });

    it("list user page 1 all data", () => {
        let data = {
            "name": "master",
            "gender": "male",
            "city": "jakarta",
            "phone": "123456789",
            "email": "email@master.com",
        };
        for (let ii = 0; ii < 100; ii++) {
            userRepo.create(data);
        }
        let output = userRepo.list(1, 0);
        assert.equal(output.length, 100);
    });

    it("update data", () => {
        let data = {
            "name": "master",
            "gender": "male",
            "city": "jakarta",
            "phone": "123456789",
            "email": "email@master.com",
        };
        let updatedData = {
            "gender": "female",
            "city": "bandung"
        };
        let insertData = userRepo.create(data);
        let output = userRepo.update(insertData.id, updatedData);
        let expectedOutput = {
            "name": "master",
            "gender": "female",
            "city": "bandung",
            "phone": "123456789",
            "email": "email@master.com",
            id: 1
        };
        assert.deepEqual(output, expectedOutput);
    });
});