'use strict';

const chai = require('chai');
const assert = require('chai').assert;
const chaiHttp = require('chai-http');
const Injector = require('../injector');
const config = require('./config.test.json');

describe("Injector Test", function () {
    let injector;

    before(() => {
        chai.use(chaiHttp);
        injector = new Injector(config);
        injector.start();
    });

    it("is initialized", () => {
        let configComponents = config.components;

        Object.keys(configComponents).forEach(function (component) {
            assert.isNotNull(injector.module[component]);
            assert.isNotNull(injector.components[component]);
        });
    });

    it("server is up", (done) => {
        let main = config.main;
        let request = chai.request(injector.components[main.component].app);
        request.get('/')
            .end((err, res) => {
                assert.equal(res.text, "Hello World!");
                done();
            });
    });
});