import { NextFunction, Request, Response } from "express";
import { validate } from "../core/validator-engine.js";
import { parseSchema, RawSchema } from "../core/schema-parser.js";

interface ValidResponse {
	valid: true;
	validated: Record<string, any>;
}

interface InvalidResponse {
	valid: false;
	errors: Record<string, string>;
}

declare module 'express-serve-static-core' {
	interface Request {
		validated: { body?: Record<string, any>, params?: Record<string, any>, query?: Record<string, any> },
		validate: (schema: RawSchema, data: Record<string, any>) => ValidResponse|InvalidResponse,
		validateBody: (schema: RawSchema) => ValidResponse|InvalidResponse,
		validateParams: (schema: RawSchema) => ValidResponse|InvalidResponse,
		validateQuery: (schema: RawSchema) => ValidResponse|InvalidResponse,
	}
}

const validationHandler = (schema: RawSchema, data: Record<string, any> = {}): ValidResponse|InvalidResponse => {
	const validated = validate(parseSchema(schema), data || {});
	const invalid = Object.entries(validated).filter(([field, { valid }]) => valid === false).map(([field, { error}]) => [field, error]);

	if (invalid.length) {
		return { valid: false, errors: Object.fromEntries(invalid) } as InvalidResponse;
	}

	return {
		valid: true,
		validated: Object.fromEntries(
			Object.entries(validated).map(
				([field, { processedValue }]) => [field, processedValue]
			)
		)
	} as ValidResponse;
}

export const plugin = (req: Request, res: Response, next: NextFunction) => {
	req.validate = (schema: RawSchema, data: Record<string, any>) => validationHandler(schema, data),
	req.validateBody = (schema: RawSchema) => validationHandler(schema, req.body),
	req.validateParams = (schema: RawSchema) => validationHandler(schema, req.params),
	req.validateQuery = (schema: RawSchema) => validationHandler(schema, req.query),
	next();
}

export const validateBody = (schema: RawSchema) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const validation = validationHandler(schema, req.body || {});

		if (!validation.valid) {
			return res.status(400).json({
				status: 'error',
				message: 'Body validation failed',
				errors: validation.errors
			});
		}

		req.validated = { body: validation.validated };
		next();
	}
}

export const validateParams = (schema: RawSchema) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const validation = validationHandler(schema, req.params || {});

		if (!validation.valid) {
			return res.status(400).json({
				status: 'error',
				message: 'Parameters validation failed',
				errors: validation.errors
			});
		}

		req.validated = { params: validation.validated };
		next();
	}
}

export const validateQuery = (schema: RawSchema) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const validation = validationHandler(schema, req.query || {});

		if (!validation.valid) {
			return res.status(400).json({
				status: 'error',
				message: 'Query validation failed',
				errors: validation.errors
			});
		}

		req.validated = { query: validation.validated };
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