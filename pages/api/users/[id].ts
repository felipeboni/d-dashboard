const bcrypt = require('bcrypt');

import { apiHandler } from 'helpers/api';
import { usersRepo, omit } from 'helpers/api';

export default apiHandler({
    get: getById,
    put: update,
    delete: _delete
});

const getById = (req, res) => {
    const user = usersRepo.getById(req.query.id);

    if (!user) throw 'User not found';
    return res.status(200).json(omit(user, 'hash'));
}

const update = (req, res) => {
    const user = usersRepo.getById(req.query.id);

    if (!user) throw 'User not found';

    // Split out password from user details
    const { password, ...params } = req.body;

    // Validate
    if (user.username !== params.username && usersRepo.find(x => x.username === params.username))
        throw `User with the username "${params.username}" already exists`;

    // Only update hashed password if entered
    if (password) user.hash = bcrypt.hashSync(password, 10);

    usersRepo.update(req.query.id, params);
    return res.status(200).json({});
}

const _delete = (req, res) => {
    usersRepo.delete(req.query.id);
    return res.status(200).json({});
}