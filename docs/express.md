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
const { expressValidator } = require('superform-validator');

// OR Light weight express only import
// const expressValidator = require('superform-validator/express');

const app = express();
app.use(expressValidator.plugin); // If using in callback mode 

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
```

> 📣 Plugin Registration required only for callback mode (`req.validate*` methods)

---

# ✨ Usage Modes

## ✅ Middleware Mode

### Validate Query Parameters

```js
const queryMiddleware = expressValidator.validateQuery({
  page: 'require|integer|integer::gt(0)|cast::integer',
  limit: 'optional|integer|integer::between(10,100)|default(10)|cast::integer'
});

app.get('/users', [queryMiddleware], (req, res) => {
  res.json(req.validated);
});
```

### Validate Body

```js
const bodyMiddleware = expressValidator.validateBody({
  mobile: 'require|integer|mobile|cast::integer',
  email: 'require|email|maxLength(128)|cast::lower|trim'
});

app.post('/users', [bodyMiddleware], (req, res) => {
  res.json(req.validated);
});
```

### Validate Route Parameters

```js
const paramMiddleware = expressValidator.validateParams({
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
const { expressValidator } = require('superform-validator');

const app = express();
app.use(expressValidator.plugin); // <==
```

### Validate Query

```js
app.get('/users', (req, res) => {
  const validation = req.validateQuery({
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
app.post('/users', (req, res) => {
  const validation = req.validateBody({
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
app.get('/users/:mobile/:email', (req, res) => {
  const validation = req.validateParams({
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
app.post('/custom', (req, res) => {
  const customPayload = req.headers;

  const validation = req.validate({
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

## 📂 Validation Result Structure

| Property               | Description                             |
| ---------------------- | --------------------------------------- |
| `validation.valid`     | Boolean indicating validation success   |
| `validation.errors`    | Object containing field-specific errors |
| `validation.validated` | Validated and processed data            |

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

```json
{
  "status": "error",
  "message": "Query validation failed",
  "errors": {
    "page": "Page must be greater than 0",
    "limit": "Limit must be between 10 and 100"
  }
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