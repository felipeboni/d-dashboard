const bcrypt = require('bcryptjs');

import { apiHandler, usersRepo } from 'helpers/api';
import { Request, Response } from 'express';

const register = (req: Request, res: Response) => {
    // Split out password from user details
    const { password, ...user } = req.body;

    // Validate
    if (usersRepo.find(x => x.username === user.username))
        throw `User with the username "${user.username}" already exists`;

    // Hash password
    user.hash = bcrypt.hashSync(password, 10);

    usersRepo.create(user);
    return res.status(200).json({});
}

export default apiHandler({
    post: register
});