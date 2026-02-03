# 📦 SuperForm Validator

A powerful, flexible, and universal JavaScript form validation library that supports **Native HTML Forms**, **Express.js API validation** and **React form validation**.

![npm](https://img.shields.io/npm/v/superform-validator)
![npm bundle size (version)](https://img.shields.io/bundlephobia/min/superform-validator)
![GitHub release (by tag)](https://img.shields.io/github/downloads/khairnar2960/superform-validator/stable/total)
![jsDelivr hits (npm)](https://img.shields.io/jsdelivr/npm/hy/superform-validator)
![npm](https://img.shields.io/npm/dy/superform-validator)
![GitHub issues](https://img.shields.io/github/issues-raw/khairnar2960/superform-validator)
![GitHub closed issues](https://img.shields.io/github/issues-closed-raw/khairnar2960/superform-validator)

---

## 🚀 Features

| Feature                            | Supported      |
| ---------------------------------- | -------------- |
| Native HTML Form Validation        | ✅ Yes         |
| Express.js Integration             | ✅ Yes         |
| File Input Validation              | ✅ Yes         |
| Type Casting & Pre/Post Processors | ✅ Yes         |
| Live Validation Support            | ✅ Yes         |
| Custom Rule Registration           | ✅ Yes         |
| Flexible Error Formatting Engine   | ✅ Yes         |
| TypeScript Ready                   | ✅ Yes         |
| React Support                      | ✅ Yes         |

---

## 📦 Installation

```bash
npm install superform-validator
```

### CDN Usage

```html
<!-- jsDeliver -->
<!-- Latest version -->
<script src="https://cdn.jsdelivr.net/npm/superform-validator@latest/dist/form-validator.js"></script>

<!-- OR -->

<!-- Recommended with specific version -->
<script src="https://cdn.jsdelivr.net/npm/superform-validator@2.1.0/dist/form-validator.js"></script>

<!-- OR -->

<!-- unpkg -->
<script src="https://unpkg.com/superform-validator@2.1.0/dist/form-validator.js"></script>
```

---

## 🔄 Quick Examples

### HTML Form

```js
const validator = FormValidator.init('#myForm', schema, onValid, onError, options);
validator.enableLiveValidation();
```

### Express Middleware

```js
app.get('/users', expressValidator.validateQuery({
  page: 'require|integer|gt(0)|cast::integer'
}), (req, res) => {
  res.json(req.validated);
});
```

### Error Formatter

```js
const msg = ErrorFormatter.format('Welcome @{user.name || "Guest"}', { user: {} });
```

---

## 📓 Full Documentation

- 📝 [HTML Form Validator](./docs/html-form.md)
- 🟢 [Live Validation](#live-validation)
- 🔗 [Custom Rule Registration](./docs/custom-rules.md)
- 🔌 [Express.js Plugin Guide](./docs/express.md)
- ❌ [Error Formatter Guide](./docs/error-formatter.md)
- 🕳 [Error Placeholders](#error-placeholder-reference)
- ✳ [Validation Schemas](#validation-schemas)
- ✅ [Validation Rules](#validation-rules)
- ⚡ [Validation Result Structure](#validation-result-structure)
- 🔤 [Rules and Processors Reference](./docs/rules-and-processors.md)
- 🟦 [React Middleware Guide](./docs/react.md)
- 🧪 [React Examples](./docs/react-examples.md)

---

## 🔄 Live Validation

```js
validator.enableLiveValidation(['blur', 'change', 'input']);
```

Default events: `blur`, `change`.

---

## 🔧 Custom Rule Registration

```js
FormValidator.registerRule({
  name: 'isEven',
  paramType: 'none',
  argumentType: 'integer',
  aliases: [],
  validators: [
    {
      callback: (value) => parseInt(value) % 2 === 0,
      message: '@{field} must be an even number'
    }
  ]
}, 'integer');
```

---

## 🔎 Validation Schemas

### String Syntax

```js
{
  email: 'require|email|case::lower',
  age: 'require|integer|length(2)|intBetween(10, 15)|cast::integer',
  gender: 'optional|inList(male,female,other,none)|default(none)'
}
```

### Object Syntax with Custom Messages

```js
{
  name: {
    require: true,
    minLength: 2,
    maxLength: 20,
    messages: {
      require: 'Name is required.',
      minLength: 'Name must be at least 2 characters.',
      maxLength: 'Name must be less than 20 characters.'
    }
  }
}
```

---

## 🔒 Validation Rules

Supported rules include:

* `require`, `minLength`, `maxLength`, `length`, `email`, `integer`, `float`, `mobile`
* `file::maxFiles`, `file::maxSize`, `file::accepts`
* Pre/Post processors like `trim`, `case::camel`, `case::upper`
* Casting: `cast::integer`, `cast::boolean`, `cast::float`
* Full list available in detailed rule reference (coming soon)
> [Full list of available rules and processors](./docs/rules-and-processors.md)

---

## 🔐 Error Placeholder Reference

Supported placeholders:

```text
@{field}
@{param.field}
@{param.value}
@{param}
@{param.min}
@{param.max}
@{param.raw}
```

Supports advanced formatting with nested access, fallbacks, and string modifiers like `upper`, `lower`, `capitalize`.

> [Error Formatter Guide](./docs/error-formatter.md)

---

## 📂 Validation Result Structure

```ts
{
  valid: boolean;
  validated: Record<string, any>;
  errors: Record<string, string>;
}
```

`req.validated` is available in Express.

---

## 🌟 Planned Features

* 🌐 Multi-language support
* 👥 Field grouping and nested schema support

---

## 💻 Examples

- [Basic Form Validation](./examples/basic-form.html)
- [File Upload Validation](./examples/file-upload.html)
- [Date and Time Validation](./examples/date-time.html)
- [Custom Rule: Even Number](./examples/custom-rule.html)
- [Express Middleware Example](./examples/express-middleware.js)
- [Express Callback Example](./examples/express-callback.js)
- [React Basic Example](./examples/react-basic.tsx)
- [React Controller Example](./examples/react-controller.tsx)

---

## 📜 License

Released under the [MIT License](LICENSE)

---

## 👨‍💻 Author

Made with ❤️ by **Harshal Khairnar**  
Founder, [Hitraa Technologies](https://hitraa.com)  
📧 [harshal@hitraa.com](mailto:harshal@hitraa.com)  
