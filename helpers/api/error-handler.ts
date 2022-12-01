import { Response } from 'express';


export const errorHandler = (err: string | { name: string; message: string; }, res: Response) => {
    if (typeof (err) === 'string') {
        // Custom app error

        const is404 = err.toLowerCase().endsWith('not found');
        const statusCode = is404 ? 404: 400;
        return res.status(statusCode).json({ message: err });
    }

    if (err.name === 'UnauthorizedError') {
        // JWT Auth error
        return res.status(401).json({ message: 'Invalid Token' });
    }

    console.error(err);
    return res.status(500).json({ message: err.message });
}