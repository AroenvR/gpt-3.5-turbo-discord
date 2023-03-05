import app from "../providers/expressProvider";
import { constants } from "../util/constants";
import { isTruthy } from "../util/isTruthy";

/**
 * Starts the Foo Service.
 */
export const runFooApi = () => {

    /**
     * GET for /foo
     */
    app.get('/foo', (req: any, res: any) => {
        res.setHeader('Access-Control-Allow-Origin', constants.FRONTEND_URL);
    
        console.log("GET for /foo got called");
    
        res.status(200)
            .send({
                data: 'Hello from foo!',
            });
    });

    /**
     * POST for /foo
     */
    app.post('/foo', (req: any, res: any) => {
        res.setHeader('Access-Control-Allow-Origin', constants.FRONTEND_URL);
        console.log("POST for /foo got called");

        const data = req.body;

        if (!isTruthy(data)) {
            res.status(400)
                .send({
                    data: null,
                    message: 'Bad Request',
                });
            return;
        }


        res.status(201)
            .send({
                data: { id: 1, name: 'foo' },
                message: 'success',
            });
    });
}
