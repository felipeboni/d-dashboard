const expressJwt = require('express-jwt');
const util = require('util');
import getConfig from 'next/config';
import { Request, Response } from 'express';

const { serverRuntimeConfig } = getConfig();

export const jwtMiddleware = (req: Request, res: Response) => {
    const middleware = expressJwt({
        secret: serverRuntimeConfig.secret,
        algorithms: ['HS256']
    }).unless({
        path: [
            '/api/users/register',
            '/api/users/authenticate'
        ]
    })

    return util.promisify(middleware)(req, res);
}