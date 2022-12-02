import { errorHandler } from './error-handler';
import { jwtMiddleware } from './jwt-middleware';
import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

export const apiHandler = (handler: { [x: string]: (arg0: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, arg1: Response<any, Record<string, any>>) => any; }) => {
    return async (req: Request, res: Response) => {
        const method = req.method.toLowerCase();

        // Check if handler supports HTTP method
        if (!handler[method])
            return res.status(405).end(`Method ${method} not allowed!`);

        try {
            // Global middleware
            await jwtMiddleware(req, res);

            // Route handler
            await handler[method](req, res);
        } catch (err: any) {
            errorHandler(err, res);
        }
    }
}