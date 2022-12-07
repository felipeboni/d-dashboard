const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

import { Request, Response } from 'express';
import getConfig from "next/config";
import { apiHandler, usersRepo } from 'helpers/api';

const { serverRuntimeConfig } = getConfig();

const authenticate = (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = usersRepo.find(u => u.username === username);

    // Validate
    if (!(user && bcrypt.compareSync(password, user.hash))) throw 'Username or password is incorrect';

    // Create a JWT token that is valid for 7 days
    const token = jwt.sign({ sub: user.id }, serverRuntimeConfig.secret, { expiresIn: '7d' });

    // Return basic user details and token
    return res.status(200).json({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        token
    });
}

export default apiHandler({
    post: authenticate
});