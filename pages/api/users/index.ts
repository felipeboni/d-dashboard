import { apiHandler, usersRepo, omit } from 'helpers/api';
import { Request, Response } from 'express';

const getUsers = (req: Request, res: Response) => {
    // Return users without hashed passwords in the response
    const response = usersRepo.getAll().map(x => omit(x, 'hash'));
    return res.status(200).json(response);
}

export default apiHandler({
    get: getUsers
});