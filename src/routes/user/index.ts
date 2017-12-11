import {Router, Request, Response, NextFunction} from 'express';
import * as moment from 'moment';


export class UserRouter {
    public router: Router;
    public client;

    constructor() {
        this.router = Router();
     
        this.init();
    }

    private getData = (req: Request, res: Response, next: NextFunction): void => {
        return res.status(200).send({
            response: {
                message: "Success",
                response_code: 200
            }
        });
    };



    init() {
        this.router.post('/get/data', this.getData);
    }

}

// Create the UserRouter, and export its configured Express.Router.
let userRoutes = new UserRouter();
userRoutes.init();

export default userRoutes.router;
