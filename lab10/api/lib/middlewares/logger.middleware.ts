import { Request, Response, NextFunction } from 'express';

export const loggerMiddleware = (request: Request, response: Response, next: NextFunction) => {
    console.log(`[${request.method}] ${request.url} ${new Date().toISOString()}`);
    next();
};