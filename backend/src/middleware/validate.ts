import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";

export const validate = (
  schema: ZodType,
  source: "body" | "params" | "query" = "body"
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dataToValidate = req[source] || {};
    const result = schema.safeParse(dataToValidate);

    if (!result.success) {
      const error = result.error as ZodError;
      const flattened = error.flatten();

      return res.status(400).json({
        message: "Validation failed",
        errors: flattened.fieldErrors,
        issues: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
          code: issue.code,
        })),
      });
    }

    // Replace request data with parsed/sanitized data
    (req as any)[source] = result.data;
    next();
  };
};
