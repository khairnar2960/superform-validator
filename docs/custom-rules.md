# 📄 SuperForm Validator: Custom Rules Guide

SuperForm Validator allows you to define your own validation rules to fit any specific business logic.

---

## 1. Without registering custom rule _(Basic)_

### Using `custom(/regex/flag)`

```js
quantity: 'require|integer|custom(/^\d*[05]$/)'
```

> In-String regex also supports flags (i,g,m...)

### Using custom object pattern

```js
quantity: {
  custom: {
    pattern: (value) => /^\d*[05]$/.test(value),
    message: '@{field} must be a multiple of 5'
  }
}
```

### Using custom object callback

```js
quantity: {
  custom: {
    callback: (value) => parseInt(value) % 5 === 0,
    message: '@{field} must be a multiple of 5'
  }
}
```

## 2. Registering custom rule _(Advance)_

### 🚀 Quick Syntax

```js
FormValidator.registerRule(schema, type);
```

or using instance:

```js
validator.registerRule(schema, type);
```

* **Must be registered before** calling `FormValidator.init`.

---

### 🛠️ Rule Schema Structure

| Field          | Description                             |
| -------------- | --------------------------------------- |
| `name`         | Rule name (used as `type::name`)        |
| `paramType`    | 'none', 'single', 'range', 'list', etc. |
| `argumentType` | Expected argument data type             |
| `aliases`      | Array of alternative rule names         |
| `validators`   | List of validation steps                |

---

#### 📌 Example: Custom Even Number Rule

```js
FormValidator.registerRule({
  name: 'isEven',
  paramType: 'none',
  argumentType: 'integer',
  aliases: ['even'],
  validators: [
    {
      callback: (value) => parseInt(value) % 2 === 0,
      message: '@{field} must be an even number'
    }
  ]
}, 'integer');
```

Use in schema:

```js
age: 'require|integer|integer::isEven'
```

---

### 🎛 Supported `paramType`

* `none`: No parameter required (e.g. integer, email, mobile).
* `single`: One parameter (e.g. minLength(5)).
* `range`: Two parameters (e.g. between(5,10)).
* `list`: Comma-separated list (e.g. inList(a,b,c)).
* `fileSize`: For file rules.
* `fieldReference`: Refers to another field (e.g. match(password)).
* `fieldEquals`: Must be equal to another field value.

---

### 🔧 Validator Callback Signature

```ts
type callback = (value: any, param: any, fields: Record<string, Field>) => boolean;

interface Field {
  name: string,
  value: any,
}
```

---

### 📚 Advanced Schema Example

```js
FormValidator.registerRule({
  name: 'isMultiple',
  paramType: 'single',
  argumentType: 'integer',
  aliases: ['multipleOf'],
  validators: [
    {
      callback: (value, param) => parseInt(value) % param === 0,
      message: '@{field} must be a multiple of @{param}'
    }
  ]
}, 'integer');

// Usage
quantity: 'require|integer|integer::isMultiple(5)'
// OR
quantity: 'require|integer|multipleOf(5)'
// Error message `Quantity must be a multiple of 5`
```

---

## 🔗 Additional Resources

* [HTML Form Guide](./html-form.md)
* [Express Plugin Guide](./express.md)
* [Error Formatter](./error-formatter.md)
