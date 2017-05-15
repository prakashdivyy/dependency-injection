'use strict';

let Injector = require('./injector-generic.js');
let config = require('./config-generic.json');
let injector = new Injector(config);
injector.start();