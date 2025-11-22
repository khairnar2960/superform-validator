import type { NextFunction, Request, Response } from "express";
import { validate } from "../core/validator-engine.js";
import { parseSchema, type RawSchema } from "../core/schema-parser.js";

interface ValidResponse {
	valid: true;
	validated: Record<string, any>;
}

interface InvalidResponse {
	valid: false;
	errors: Record<string, string>;
}

interface ValidateOptions {
	message?: string;
	wrap?: boolean;
	ungrouped?: boolean;
}

declare module 'express-serve-static-core' {
	interface Request {
		validated: { body?: Record<string, any>, params?: Record<string, any>, query?: Record<string, any> },
		validate: (schema: RawSchema, data: Record<string, any>) => Promise<ValidResponse|InvalidResponse>,
		validateBody: (schema: RawSchema) => Promise<ValidResponse|InvalidResponse>,
		validateParams: (schema: RawSchema) => Promise<ValidResponse|InvalidResponse>,
		validateQuery: (schema: RawSchema) => Promise<ValidResponse|InvalidResponse>,
	}
}
type ParsedErrors = Record<string, string>|Record<string, string>[];

const parseGrouped = (errors: Record<string, string>, options: ValidateOptions = {}): ParsedErrors|ParsedErrors[] => {
	let data: ParsedErrors = errors;

	if (options?.ungrouped) {
		data = Object.entries(errors).map(([field, error]: [string, string]) => {
			return { [field]: error }
		})
	}

	if (options?.wrap) {
		data = [data] as ParsedErrors;
	}

	return data;
}

const validationHandler = async (schema: RawSchema, data: Record<string, any> = {}): Promise<ValidResponse|InvalidResponse> => {
	const invalid = Object.entries(validated).filter(([field, { valid }]) => valid === false).map(([field, { error}]) => [field, error]);
	const validated = await validate(parseSchema(schema), data || {});

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

export const validateBody = (schema: RawSchema, options: ValidateOptions = {}) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const validation = await validationHandler(schema, req.body || {});

		if (!validation.valid) {
			return res.status(400).json({
				status: 'error',
				message: options?.message || 'Body validation failed',
				errors: parseGrouped(validation.errors, options)
			});
		}

		req.validated = { body: validation.validated };
		next();
	}
}

export const validateParams = (schema: RawSchema, options: ValidateOptions = {}) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const validation = await validationHandler(schema, req.params || {});

		if (!validation.valid) {
			return res.status(400).json({
				status: 'error',
				message: options?.message || 'Parameters validation failed',
				errors: parseGrouped(validation.errors, options)
			});
		}

		req.validated = { params: validation.validated };
		next();
	}
}

export const validateQuery = (schema: RawSchema, options: ValidateOptions = {}) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const validation = await validationHandler(schema, req.query || {});

		if (!validation.valid) {
			return res.status(400).json({
				status: 'error',
				message: options?.message || 'Query validation failed',
				errors: parseGrouped(validation.errors, options)
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