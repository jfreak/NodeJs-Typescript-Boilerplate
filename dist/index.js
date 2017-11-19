"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const debug = require("debug");
const winston = require("winston");
const App_1 = require("./App");
class Server {
    getServerInstance() {
        return this.server;
    }
    static bootstrap() {
        if (!this.serverInstance) {
            this.serverInstance = new Server();
            return this.serverInstance;
        }
        else {
            return this.serverInstance;
        }
    }
    debugMod() {
        debug('ts-express:server');
        winston.add(winston.transports.File, { filename: 'application.log' });
    }
    constructor() {
        this.debugMod();
        this.runServer();
    }
    runServer() {
        this.port = this.normalizePort(process.env.PORT || 3500);
        App_1.default.set('port', this.port);
        this.createServer();
    }
    createServer() {
        this.server = http.createServer(App_1.default);
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
    }
    /**
     * normalize port
     * @param {number | string} val
     * @returns {number}
     */
    normalizePort(val) {
        let port = (typeof val === 'string') ? parseInt(val, 10) : val;
        return port;
    }
}
exports.server = Server.bootstrap();
