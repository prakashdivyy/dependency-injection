'use strict';

const chai = require('chai');
const assert = require('chai').assert;
const chaiHttp = require('chai-http');
const Memstore = require('../components/store/memory_store');
const ApiServer = require('../components/server/api_server');
const ConversationRepo = require('../components/repo/conversation_repo');
const UserRepo = require('../components/repo/user_repo');

describe("APIServer Test", function () {
    let request;

    before(() => {
        chai.use(chaiHttp);
        let store = new Memstore();
        let convRepo = new ConversationRepo(store);
        let userRepo = new UserRepo(store);
        let server = new ApiServer(convRepo, userRepo);
        server.start(5000);
        request = chai.request(server.app);
    });

    describe("/users routes", function () {
        it("server is up", (done) => {
            request.get('/')
                .end((err, res) => {
                    assert.equal(res.text, "Hello World!");
                    done();
                });
        });

        it("get all users when user is 0", (done) => {
            request.get('/users')
                .end((err, res) => {
                    assert.deepEqual(res.body, []);
                    done();
                });
        });

        it("get user by id when no user with that id", (done) => {
            request.get('/users/1')
                .end((err, res) => {
                    assert.equal(res.body, "");
                    done();
                });
        });

        it("delete user by id when no user with that id", (done) => {
            request.delete('/users/1')
                .end((err, res) => {
                    assert.equal(res.body, "");
                    done();
                });
        });

        it("insert one user", (done) => {
            let data = {
                "name": "master",
                "gender": "male",
                "city": "jakarta",
                "phone": "123456789",
                "email": "email@master.com",
            };

            let expectedOutput = {
                "name": "master",
                "gender": "male",
                "city": "jakarta",
                "phone": "123456789",
                "email": "email@master.com",
                "id": 1
            };

            request.post('/users').send(data)
                .end((err, res) => {
                    assert.deepEqual(res.body, expectedOutput);
                    done();
                });
        });

        it("get user by id", (done) => {
            let expectedOutput = {
                "name": "master",
                "gender": "male",
                "city": "jakarta",
                "phone": "123456789",
                "email": "email@master.com",
                "id": 1
            };

            request.get('/users/1')
                .end((err, res) => {
                    assert.deepEqual(res.body, expectedOutput);
                    done();
                });
        });

        it("update user by id", (done) => {
            let data = {
                "name": "chika",
                "gender": "female",
                "city": "bandung",
            };

            let expectedOutput = {
                "name": "chika",
                "gender": "female",
                "city": "bandung",
                "phone": "123456789",
                "email": "email@master.com",
                "id": 1
            };

            request.put('/users/1').send(data)
                .end((err, res) => {
                    assert.deepEqual(res.body, expectedOutput);
                    done();
                });
        });

        it("insert 4 more users and get all users", (done) => {
            let data = {
                "name": "master",
                "gender": "male",
                "city": "jakarta",
                "phone": "123456789",
                "email": "email@master.com",
            };

            for (let ii = 0; ii < 4; ii++) {
                request.post('/users').send(data).end();
            }

            request.get('/users')
                .end((err, res) => {
                    assert.equal(res.body.length, 5);
                    done();
                });
        });
    });

    describe("/conversations routes", function () {
        it("server is up", (done) => {
            request.get('/')
                .end((err, res) => {
                    assert.equal(res.text, "Hello World!");
                    done();
                });
        });

        it("get all conversations when conversation is 0", (done) => {
            request.get('/conversations')
                .end((err, res) => {
                    assert.deepEqual(res.body, []);
                    done();
                });
        });

        it("get conversations by id when no conversation with that id", (done) => {
            request.get('/conversations/1')
                .end((err, res) => {
                    assert.equal(res.body, "");
                    done();
                });
        });

        it("delete conversations by id when no conversation with that id", (done) => {
            request.delete('/conversations/1')
                .end((err, res) => {
                    assert.equal(res.body, "");
                    done();
                });
        });

        it("insert one conversation", (done) => {
            let data = {
                "userId": "1",
                "direction": "incoming",
                "message": "hello world!",
                "timestamp": 1234
            };

            let expectedOutput = {
                "id": 1,
                "userId": "1",
                "direction": "incoming",
                "message": "hello world!",
                "timestamp": 1234
            };

            request.post('/conversations').send(data)
                .end((err, res) => {
                    assert.deepEqual(res.body, expectedOutput);
                    done();
                });
        });

        it("get conversation by id", (done) => {
            let expectedOutput = {
                "id": 1,
                "userId": "1",
                "direction": "incoming",
                "message": "hello world!",
                "timestamp": 1234
            };

            request.get('/conversations/1')
                .end((err, res) => {
                    assert.deepEqual(res.body, expectedOutput);
                    done();
                });
        });

        it("update conversation by id", (done) => {
            let data = {
                "direction": "outgoing",
                "message": "chika bandung",
                "timestamp": 812738
            };

            let expectedOutput = {
                "id": 1,
                "userId": "1",
                "direction": "outgoing",
                "message": "chika bandung",
                "timestamp": 812738
            };

            request.put('/conversations/1').send(data)
                .end((err, res) => {
                    assert.deepEqual(res.body, expectedOutput);
                    done();
                });
        });

        it("insert 4 more conversations and get all conversations", (done) => {
            let data = {
                "userId": "1",
                "direction": "incoming",
                "message": "hello world!",
                "timestamp": 1234
            };

            for (let ii = 0; ii < 4; ii++) {
                request.post('/conversations').send(data).end();
            }

            request.get('/conversations')
                .end((err, res) => {
                    assert.equal(res.body.length, 5);
                    done();
                });
        });
    });
});