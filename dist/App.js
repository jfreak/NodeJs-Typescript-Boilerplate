"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const WebSocket = require("ws");
const http = require("http");
const debug = require("debug");
const winston = require("winston");
class App {
    constructor() {
        this.express = express();
        this.debugMod();
        this.runServer();
        this.middleware();
        this.routes();
    }
    getServerInstance() {
        return this.server;
    }
    static bootstrap() {
        if (!this.serverInstance) {
            this.serverInstance = new App();
            return this.serverInstance;
        }
        else {
            return this.serverInstance;
        }
    }
    runServer() {
        this.port = this.normalizePort(process.env.PORT || 3500);
        this.express.set('port', this.port);
        this.createServer();
    }
    createServer() {
        this.server = http.createServer(this.express);
        this.server.listen(this.port);
        this.server.on('listening', () => {
            let address = this.server.address();
            let bind = (typeof address === 'string') ? `pipe ${address}` : `port ${address.port}`;
            debug(`Listening on ${bind}`);
        });
        this.server.on('error', (error) => {
            if (error.syscall !== 'listen')
                throw error;
            console.error(error);
            process.exit(1);
        });
        this.webSocket();
    }
    normalizePort(val) {
        let port = (typeof val === 'string') ? parseInt(val, 10) : val;
        return port;
    }
    debugMod() {
        debug('ts-express:server');
        winston.add(winston.transports.File, { filename: 'application.log' });
    }
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
    routes() {
        this.express.use('/', (req, res) => {
            res.status(404).send({ error: `path doesn't exist` });
        });
    }
    webSocket() {
        const server = this.server;
        const wss = new WebSocket.Server({ server });
        wss.on('connection', (ws) => {
            //connection is up, let's add a simple simple event
            console.log(ws);
            ws.on('message', (message) => {
                //log the received message and send it back to the client
                console.log('received: %s', message);
                ws.send(`Hello, you sent -> ${message}`);
            });
            //send immediatly a feedback to the incoming connection
            ws.send('Hi there, I am a WebSocket server');
        });
    }
}
exports.default = new App().express;
