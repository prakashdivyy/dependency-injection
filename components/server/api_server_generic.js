'use strict';

const express = require('express');
const bodyParser = require('body-parser');

module.exports = class ApiServer {
    constructor(options, convRepo, userRepo) {
        this.convRepo = convRepo;
        this.userRepo = userRepo;
        this.routes = options.routes;
        this.app = express();
        this.app.use(bodyParser.json())
    }

    start(port) {
        this.app.get('/', function (req, res) {
            res.send('Hello World!');
        });

        let routes = this.routes;

        for (let ii = 0; ii < routes.length; ii++) {
            let repo = routes[ii].substring(1, 5);

            if (repo === "conv") {
                repo = this.convRepo;
            } else {
                repo = this.userRepo;
            }

            this.app.route(routes[ii])
                .get(function (req, res) {
                    res.json(repo.list(1, 0));
                })
                .post(function (req, res) {
                    res.json(repo.create(req.body));
                });

            this.app.route(routes[ii] + '/:id')
                .get(function (req, res) {
                    res.json(repo.get(req.params.id));
                })
                .put(function (req, res) {
                    res.json(repo.update(req.params.id, req.body));
                })
                .delete(function (req, res) {
                    res.json(repo.remove(req.params.id));
                });
        }

        this.app.listen(port, function () {
            console.log('App listening on port ' + port + '!');
        });
    }
};