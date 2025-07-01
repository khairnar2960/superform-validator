import { NextFunction, Request, Response } from "express";
import { ValidationResponse } from "../core/validator-engine.js";
import { Validator } from "../core/validator.js";

declare module 'express-serve-static-core' {
	interface Request {
		validated: { body?: Record<string, any>, params?: Record<string, any>, query?: Record<string, any> },
		validate: (schema:Record<string, any>, data: Record<string, any>) => Record<string, ValidationResponse>,
		validateBody: (schema:Record<string, any>) => Record<string, ValidationResponse>,
		validateParams: (schema:Record<string, any>) => Record<string, ValidationResponse>,
		validateQuery: (schema:Record<string, any>) => Record<string, ValidationResponse>,
	}
}

export const expressValidator = (req: Request, res: Response, next: NextFunction) => {
	req.validate = (schema: Record<string, any>, data: Record<string, any>) => (new Validator(schema)).validate(data),
	req.validateBody = (schema: Record<string, any>) => (new Validator(schema)).validate(req.body),
	req.validateParams = (schema: Record<string, any>) => (new Validator(schema)).validate(req.params),
	req.validateQuery = (schema: Record<string, any>) => (new Validator(schema)).validate(req.query),
	next();
}

export const validateBody = (schema: Record<string, any>) => {
	const validator = new Validator(schema);
	return (req: Request, res: Response, next: NextFunction) => {
		const validated = validator.validate(req.body);

		const invalid = Object.entries(validated).filter(([field, { valid }]) => valid === false).map(([field, { error}]) => [field, error]);

		if (invalid.length) {
			return res.status(400).json({
				status: 'error',
				message: 'Validation error',
				errors: Object.fromEntries(invalid)
			});
		}

		req.validated = {
			body: Object.fromEntries(
				Object.entries(validated).map(
					([field, { processedValue }]) => [field, processedValue]
				)
			)
		} as { body?: Record<string, any> };
		next();
	}
}

export const validateParams = (schema: Record<string, any>) => {
	const validator = new Validator(schema);
	return (req: Request, res: Response, next: NextFunction) => {
		const validated = validator.validate(req.params);

		const invalid = Object.entries(validated).filter(([field, { valid }]) => valid === false).map(([field, { error}]) => [field, error]);

		if (invalid.length) {
			return res.status(400).json({
				status: 'error',
				message: 'Validation error',
				errors: Object.fromEntries(invalid)
			});
		}

		req.validated = {
			params: Object.fromEntries(
				Object.entries(validated).map(
					([field, { processedValue }]) => [field, processedValue]
				)
			)
		} as { params?: Record<string, any> };
		next();
	}
}

export const validateQuery = (schema: Record<string, any>) => {
	const validator = new Validator(schema);
	return (req: Request, res: Response, next: NextFunction) => {
		const validated = validator.validate(req.query);

		const invalid = Object.entries(validated).filter(([field, { valid }]) => valid === false).map(([field, { error}]) => [field, error]);

		if (invalid.length) {
			return res.status(400).json({
				status: 'error',
				message: 'Validation error',
				errors: Object.fromEntries(invalid)
			});
		}

		req.validated = {
			query: Object.fromEntries(
				Object.entries(validated).map(
					([field, { processedValue }]) => [field, processedValue]
				)
			)
		} as { query?: Record<string, any> };

		next();
	}
}