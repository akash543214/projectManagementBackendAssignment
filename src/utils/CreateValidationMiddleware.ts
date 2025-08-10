import {z} from 'zod';
import type { NextFunction } from 'express';
import type { Request, Response } from "express";

export const createValidationMiddleware = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];

         res.status(400).json({ error: firstError.message });
      }
      res.status(400).json({ error: 'Invalid input data' });
    }
  };
};