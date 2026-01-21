import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import httpStatus from "http-status";

const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Ensure body exists, even if empty
      if (!req.body) {
        req.body = {};
      }

      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });

      return next();
    } catch (err) {
      next(err);
    }
  };

export default validateRequest;
