import { NextFunction, Request, Response } from "express";
import { validate, ValidationResponse } from "../core/validator-engine.js";
import { parseSchema } from "../core/schema-parser.js";

declare module 'express-serve-static-core' {
	interface Request {
		validated: { body?: Record<string, any>, params?: Record<string, any>, query?: Record<string, any> },
		validate: (schema:Record<string, any>, data: Record<string, any>) => Record<string, ValidationResponse>,
		validateBody: (schema:Record<string, any>) => Record<string, ValidationResponse>,
		validateParams: (schema:Record<string, any>) => Record<string, ValidationResponse>,
		validateQuery: (schema:Record<string, any>) => Record<string, ValidationResponse>,
	}
}

export const plugin = (req: Request, res: Response, next: NextFunction) => {
	req.validate = (schema: Record<string, any>, data: Record<string, any>) => validate(parseSchema(schema), data),
	req.validateBody = (schema: Record<string, any>) => validate(parseSchema(schema), req.body),
	req.validateParams = (schema: Record<string, any>) => validate(parseSchema(schema), req.params),
	req.validateQuery = (schema: Record<string, any>) => validate(parseSchema(schema), req.query),
	next();
}

export const validateBody = (schema: Record<string, any>) => {
	const parsedSchema = parseSchema(schema);
	return (req: Request, res: Response, next: NextFunction) => {
		const validated = validate(parsedSchema, req.body || {});

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
	const parsedSchema = parseSchema(schema);
	return (req: Request, res: Response, next: NextFunction) => {
		const validated = validate(parsedSchema, req.params);

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
	const parsedSchema = parseSchema(schema);
	return (req: Request, res: Response, next: NextFunction) => {
		const validated = validate(parsedSchema, req.query);

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

const validator = {
	plugin,
	validateBody,
	validateParams,
	validateQuery,
}

export default validator;