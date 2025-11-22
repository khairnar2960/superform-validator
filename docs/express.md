# 📦 SuperForm Validator – Express Plugin

A powerful and flexible Express.js plugin for validating request data using the SuperForm Validator.

Supports:

* ✅ Middleware Mode
* ✅ Callback Mode
* ✅ Body, Query, and Params validation
* ✅ TypeScript Support with Request Augmentation

---

## 🚀 Features

* 📂 Validate `body`, `query`, `params` easily
* 🧩 Supports both middleware and callback modes
* ⚙️ Clean `req.validated` data storage
* ✅ TypeScript request augmentation
* 🔧 Flexible: validate any custom payload using `req.validate`

---

## 📦 Installation

```bash
npm install superform-validator
```

---

## 🔌 Plugin Setup

### Register Plugin

```js
const express = require('express');
const validator = require('superform-validator/express');

const app = express();
app.use(validator.plugin); // If using in callback mode 

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
```

> 📣 Plugin Registration required only for callback mode (`req.validate*` methods)

---

# ✨ Usage Modes

## ✅ Middleware Mode

### Validate Query Parameters

```js
const queryMiddleware = validator.validateQuery({
  page: 'require|integer|integer::gt(0)|cast::integer',
  limit: 'optional|integer|integer::between(10,100)|default(10)|cast::integer'
});

app.get('/users', [queryMiddleware], (req, res) => {
  res.json(req.validated);
});
```

### Validate Body

```js
const bodyMiddleware = validator.validateBody({
  mobile: 'require|integer|mobile|cast::integer',
  email: 'require|email|maxLength(128)|cast::lower|trim'
});

app.post('/users', [bodyMiddleware], (req, res) => {
  res.json(req.validated);
});
```

### Validate Route Parameters

```js
const paramMiddleware = validator.validateParams({
  mobile: 'require|integer|mobile|cast::integer',
  email: 'require|email|maxLength(128)|cast::lower|trim'
});

app.get('/users/:mobile/:email', [paramMiddleware], (req, res) => {
  res.json(req.validated);
});
```

---

## ✅ Callback Mode (_Requires Plugin Registration_)

```js
const express = require('express');
const validator = require('superform-validator/express');

const app = express();
app.use(validator.plugin); // <== register plugin
```

### Validate Query

```js
app.get('/users', async (req, res) => {
  const validation = await req.validateQuery({
    page: 'require|integer|integer::gt(0)|cast::integer',
    limit: 'optional|integer|integer::between(10,100)|default(10)|cast::integer'
  });

  if (validation.valid) {
    res.json(validation.validated);
  } else {
    res.status(400).json(validation.errors);
  }
});
```

### Validate Body

```js
app.post('/users', async (req, res) => {
  const validation = await req.validateBody({
    mobile: 'require|integer|mobile|cast::integer',
    email: 'require|email|maxLength(128)|cast::lower|trim'
  });

  if (validation.valid) {
    res.json(validation.validated);
  } else {
    res.status(400).json(validation.errors);
  }
});
```

### Validate Route Parameters

```js
app.get('/users/:mobile/:email', async (req, res) => {
  const validation = await req.validateParams({
    mobile: 'require|integer|mobile|cast::integer',
    email: 'require|email|maxLength(128)|cast::lower|trim'
  });

  if (validation.valid) {
    res.json(validation.validated);
  } else {
    res.status(400).json(validation.errors);
  }
});
```

---

## ✅ Custom Validation (Any Data Source)

```js
app.post('/custom', async (req, res) => {
  const customPayload = req.headers;

  const validation = await req.validate({
    authorization: 'require|startsWith(Bearer )'
  }, customPayload);

  if (validation.valid) {
    res.json(validation.validated);
  } else {
    res.status(400).json(validation.errors);
  }
});
```

---

## Control return response and error

```js
const options = {
	response: {
		status: 'error',            // set custom status (default 'error')
		statusCode: 404,            // set http status code (default 400)
		message: 'User not found',  // set custom message
	},
	errors: {
		emit: false,                // will not return any errors in response (default true)
		verbose: true,              // will return detailed errors (default false)
		wrap: true,                 // will wrap errors object into array (default false)
	}
};

// verbose or wrap only one works at a time
// verbose has higher precedence

app.get(
  'users/:userId',
  validateParams({
    userId: {
      require: true,
      integer: true,
      minInt: 1,
      'cast::integer': true,
    }
  }, options)
  (req, res) => {
    // userId always be an valid positive, non zero integer
    const userId = req.params.userId;
  }
);
```
---

## 📂 Validation Result Structure

| Property               | Description                                               |
| ---------------------- | --------------------------------------------------------- |
| `validation.valid`     | Boolean indicating validation success                     |
| `validation.errors`    | Object containing field-specific errors on `valid: false` |
| `validation.validated` | Validated and processed data on `valid: true`             |

---

## ✅ Request Augmentation

After registering the plugin:

```ts
req.validated; // { body, query, params }
req.validate(schema, data); // Manual validation
req.validateBody(schema); // Validate req.body
req.validateParams(schema); // Validate req.params
req.validateQuery(schema); // Validate req.query
```

---

## ✅ Example Error Response

```js
// default
{
  "status": "error",
  "message": "Query validation failed",
  "errors": {
    "page": "Page must be greater than 0",
    "limit": "Limit must be between 10 and 100"
  }
}

// options.errors.wrap: true
{
  "status": "error",
  "message": "Query validation failed",
  "errors": [
    {
      "page": "Page must be greater than 0",
      "limit": "Limit must be between 10 and 100"
    }
  ]
}

// options.errors.verbose: true
{
  "status": "error",
  "message": "Query validation failed",
  "errors": [
    {
      "field": "page",
      "rule": "integer::gt",
      "error": "Page must be greater than 0"
    },
    {
      "field": "limit",
      "rule": "integer::between",
      "error": "Limit must be between 10 and 100"
    }
  ]
}
```

---

## ✅ Example Success Response

```json
{
  "query": {
    "page": 5,
    "limit": 20
  }
}
```

---

## 🛠️ Summary

| Feature                  | Supported              |
| ------------------------ | ---------------------- |
| Middleware Mode          | ✅ Yes                 |
| Callback Mode            | ✅ Yes                 |
| Custom Source Validation | ✅ Yes                 |
| TypeScript Integration   | ✅ Yes                 |
| Custom Error Handling    | ✅ Yes                 |

## 🔗 Additional Resources

* [HTML Form Validator](./html-form.md)
* [Custom Rule Registration](./custom-rules.md)
* [Error Formatter Guide](./error-formatter.md)
* [Rules and Processors Reference](./rules-and-processors.md)