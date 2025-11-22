import type { NextFunction, Request, Response } from "express";
import { validate } from "../core/validator-engine.js";
import { parseSchema, type RawSchema } from "../core/schema-parser.js";

interface ValidResponse {
	valid: true;
	validated: Record<string, any>;
}

interface InvalidError {
	field: string;
	rule: string;
	error: string,
}

interface InvalidResponse {
	valid: false;
	errors: Record<string, InvalidError>;
}

interface ResponseOptions {
	status: string;
	statusCode: number;
	message: string;
}

interface ErrorOptions {
	emit: boolean;
	wrap: boolean;
	verbose: boolean;
}

interface ValidateOptions {
	response: Partial<ResponseOptions>,
	errors: Partial<ErrorOptions>;
}

interface JsonResponse {
	status: string;
	message: string;
	errors?: any[]|object;
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
type ParsedErrors = Record<string, string> | InvalidError[] | Record<string, string>[];

const parseGrouped = (errors: Record<string, InvalidError>, options: Partial<ValidateOptions> = {}): ParsedErrors => {
	if (options?.errors?.verbose) {
		return Object.values(errors);
	}

	let data = Object.fromEntries(Object.entries(errors).map(([field, { error }]) => [field, error])) as Record<string, string>;

	if (options?.errors?.wrap) {
		return [data];
	}

	return data;
}

const validationHandler = async (schema: RawSchema, data: Record<string, any> = {}): Promise<ValidResponse|InvalidResponse> => {
	const validated = await validate(parseSchema(schema), data || {});
	const invalid = Object.entries(validated).filter(([field, { valid }]) => valid === false).map(([field, rest]) => [field, { field, rule: `${rest.rule}::${rest.function}`, error: rest.error }]);

	if (invalid.length) {
		return { valid: false, errors: Object.fromEntries(invalid) };
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
	req.validate = async (schema: RawSchema, data: Record<string, any>) => await validationHandler(schema, data),
	req.validateBody = async (schema: RawSchema) => await validationHandler(schema, req.body),
	req.validateParams = async (schema: RawSchema) => await validationHandler(schema, req.params),
	req.validateQuery = async (schema: RawSchema) => await validationHandler(schema, req.query),
	next();
}

const buildErrorResponse = (errors: Record<string, InvalidError>, res: Response, options: Partial<ValidateOptions>, defaultMessage: string) => {
	const response: JsonResponse = {
		status: options?.response?.status || 'error',
		message: options?.response?.message || defaultMessage,
	};

	if (false !== options?.errors?.emit) {
		response.errors = parseGrouped(errors, options);
	}

	return res.status(options?.response?.statusCode || 400).json(response);
}

export const validateBody = (schema: RawSchema, options: Partial<ValidateOptions> = {}) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const validation = await validationHandler(schema, req.body || {});

		if (!validation.valid) {
			buildErrorResponse(validation.errors, res, options, 'Body validation failed');
			return;
		}

		req.validated = { body: validation.validated };
		next();
	}
}

export const validateParams = (schema: RawSchema, options: Partial<ValidateOptions> = {}) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const validation = await validationHandler(schema, req.params || {});

		if (!validation.valid) {
			buildErrorResponse(validation.errors, res, options, 'Parameters validation failed');
			return;
		}

		req.validated = { params: validation.validated };
		next();
	}
}

export const validateQuery = (schema: RawSchema, options: Partial<ValidateOptions> = {}) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const validation = await validationHandler(schema, req.query || {});

		if (!validation.valid) {
			buildErrorResponse(validation.errors, res, options, 'Query validation failed');
			return;
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
