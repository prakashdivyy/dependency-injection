'use strict';

const path = require('path');

module.exports = class Injector {
    constructor(config) {
        this.config = config;
        this.module = {};
        this.components = {};
    }

    start() {
        let configComponents = this.config.components;
        let module = this.module;
        let listComponents = [];

        Object.keys(configComponents).forEach(function (e) {
            let file = configComponents[e].file;
            module[e] = require("./" + path.dirname(file) + "/" + path.basename(file, '.js'));
            listComponents.push(e);
        });

        this.module = module;

        while (listComponents.length !== 0) {
            let key = listComponents[0];
            let depedencies = configComponents[key].depedencies;
            let initiated = true;
            let args = [];

            for (let ii = 0; ii < depedencies.length; ii++) {
                if (!this.components[depedencies[ii]]) {
                    listComponents.splice(0, 1);
                    listComponents.push(key);
                    initiated = false;
                    break;
                }
                args.push(this.components[depedencies[ii]]);
            }

            if (initiated) {
                this.components[key] = Reflect.construct(this.module[key], args);
                listComponents.splice(0, 1);
            }
        }

        let main = this.config.main;
        let server = this.components[main.component];
        server[main.method].apply(server, main.args);
    }
};