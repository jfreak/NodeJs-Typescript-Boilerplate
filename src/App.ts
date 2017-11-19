import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as debug from 'debug';
import * as winston from 'winston';


class App {

    public express: express.Application;
    private static serverInstance: App;
    private server: any;
    private port: number;

    constructor() {
        this.express = express();
        // this.debugMod();
        this.runServer();
        this.middleware();
        this.routes();
    }

    public getServerInstance(): any {
        return this.server;
    }
    public static bootstrap(): App {
        if (!this.serverInstance) {
            this.serverInstance = new App();
            return this.serverInstance;
        } else {
            return  this.serverInstance;
        }

    }

    private runServer(): void {
        this.port = this.normalizePort(process.env.PORT || 3500);
        this.express.set('port', this.port);
        this.createServer();
    }

    private createServer() {
        this.server = http.createServer(this.express);
        this.server.listen(this.port);

        this.server.on('listening', () => {
            let address = this.server.address();
            let bind = (typeof address === 'string') ? `pipe ${address}` : `port ${address.port}`;
            debug(`Listening on ${bind}`);
        });

        this.server.on('error', (error: NodeJS.ErrnoException) => {
            if (error.syscall !== 'listen') throw error;
            console.error(error);
            process.exit(1);
        });
    }

    private  normalizePort(val: number|string): number {
        let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
        return port;
    }

    private debugMod(): void {
        debug('ts-express:server');
        winston.add(winston.transports.File, { filename: 'application.log' });
    }

    private middleware(): void {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*'); // dev only
            res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            if(req.method === 'OPTIONS'){
                res.status(200).send();
            } else {
                next();
            }
        });

    }

    private routes(): void {
        this.express.use('/', (req, res) => {
            res.status(404).send({ error: `path doesn't exist`});
        });
    }

}

export default new App().express;