import * as bodyParser from "body-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import * as cors from "cors";
import * as http from 'http';
import * as debug from 'debug';



import UserRouter from './routes/user';

/** Creates and configures an ExpressJS web server. */
class App {

    
    public express: express.Application;
    private port: any;
    private server: any;

    constructor() {
        this.express = express();
        // this.debugMod();
        this.runServer();
        this.middleware();
        this.routes();
    }

    /** Configure Express middleware. */
    private middleware(): void {
        this.express.use(cors());
        this.express.use((req, res, next) => {
            res.header("Content-Type", 'application/vnd.api+json');
            next();
        });

        // this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({extended: false}));
    }

    /** Configure API endpoints. */
    private routes(): void {
        let router = express.Router();

        this.express.use('/', router);
        this.express.use('/api', UserRouter);
    }


    private runServer(): void {
        this.port = this.normalizePort(process.env.PORT || 3500);
        this.express.set('port', this.port);
        this.createServer();
    }

    private createServer = () => {
        this.server = http.createServer(this.express);
        this.server.listen(this.port);
        this.server.on('error', this.onError);
        this.server.on('listening', this.onListening);
    };

    private  onListening = (): void => {
        let address = this.server.address();
        let bind = (typeof address === 'string') ? `pipe ${address}` : `port ${address.port}`;
        debug(`Listening on ${bind}`);
    };

    private  onError = (error: NodeJS.ErrnoException): void => {
        if (error.syscall !== 'listen') throw error;
        let bind = (typeof this.port === 'string') ? 'Pipe ' + this.port : 'Port ' + this.port;
        switch(error.code) {
            case 'EACCES':
                console.error(`${bind} requires elevated privileges`);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(`${bind} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    };

    private normalizePort = (val: number|string): number|string|boolean => {
        let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
        if (isNaN(port)) return val;
        else if (port >= 0) return port;
        else return false;
    };

    private debugMod(): void {
        debug('ts-express:server');
    }



}

export default new App().express;


