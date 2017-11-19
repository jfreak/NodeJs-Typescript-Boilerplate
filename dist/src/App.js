"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
class App {
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }
    /**
     * http(s) request middleware
     */
    middleware() {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*'); // dev only
            res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            if (req.method === 'OPTIONS') {
                res.status(200).send();
            }
            else {
                next();
            }
        });
    }
    /**
     * app environment configuration
     */
    /**
     * API main v1 routes
     */
    routes() {
        this.express.use('/', (req, res) => {
            res.status(404).send({ error: `path doesn't exist` });
        });
    }
}
exports.default = new App().express;
