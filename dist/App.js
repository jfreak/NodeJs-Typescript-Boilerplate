"use strict";
exports.__esModule = true;
var bodyParser = require("body-parser");
var express = require("express");
var cors = require("cors");
var http = require("http");
var debug = require("debug");
var user_1 = require("./routes/user");
/** Creates and configures an ExpressJS web server. */
var App = /** @class */ (function () {
    function App() {
        var _this = this;
        this.createServer = function () {
            _this.server = http.createServer(_this.express);
            _this.server.listen(_this.port);
            _this.server.on('error', _this.onError);
            _this.server.on('listening', _this.onListening);
        };
        this.onListening = function () {
            var address = _this.server.address();
            var bind = (typeof address === 'string') ? "pipe " + address : "port " + address.port;
            debug("Listening on " + bind);
        };
        this.onError = function (error) {
            if (error.syscall !== 'listen')
                throw error;
            var bind = (typeof _this.port === 'string') ? 'Pipe ' + _this.port : 'Port ' + _this.port;
            switch (error.code) {
                case 'EACCES':
                    console.error(bind + " requires elevated privileges");
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    console.error(bind + " is already in use");
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        };
        this.normalizePort = function (val) {
            var port = (typeof val === 'string') ? parseInt(val, 10) : val;
            if (isNaN(port))
                return val;
            else if (port >= 0)
                return port;
            else
                return false;
        };
        this.express = express();
        // this.debugMod();
        this.runServer();
        this.middleware();
        this.routes();
    }
    /** Configure Express middleware. */
    App.prototype.middleware = function () {
        this.express.use(cors());
        this.express.use(function (req, res, next) {
            res.header("Content-Type", 'application/vnd.api+json');
            next();
        });
        // this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    };
    /** Configure API endpoints. */
    App.prototype.routes = function () {
        var router = express.Router();
        this.express.use('/', router);
        this.express.use('/api/trip', user_1["default"]);
    };
    App.prototype.runServer = function () {
        this.port = this.normalizePort(process.env.PORT || 3500);
        this.express.set('port', this.port);
        this.createServer();
    };
    App.prototype.debugMod = function () {
        debug('ts-express:server');
    };
    return App;
}());
exports["default"] = new App().express;
