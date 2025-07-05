# 📄 SuperForm Validator: HTML Form Validation Guide

SuperForm Validator provides a simple, flexible way to validate native HTML forms with live validation support and custom error handling.

---

## 🚀 Quick Start

### 📥 Include Library


```html
<!-- jsDeliver -->
<!-- Always latest version -->
<script src="https://cdn.jsdelivr.net/npm/superform-validator@latest/dist/form-validator.js"></script>

<!-- OR -->

<!-- Recommended with specific version -->
<script src="https://cdn.jsdelivr.net/npm/superform-validator@2.0.1/dist/form-validator.js"></script>

<!-- OR -->

<!-- unpkg -->
<script src="https://unpkg.com/superform-validator@2.0.1/dist/form-validator.js"></script>
```

### 📝 Basic Form Example

```html
<form id="myForm">
  <input type="text" name="name" placeholder="Enter name" />
  <input type="email" name="email" placeholder="Enter email" />
  <input type="password" name="password" placeholder="Enter password" />
  <button type="submit">Submit</button>
</form>
```

### ⚙️ Initialize Validator

```js
const schema = {
  name: 'require|minLength(2)|maxLength(50)',
  email: 'require|email',
  password: 'require|minLength(6)'
};

const validator = FormValidator.init('#myForm', schema, (data) => {
  console.log('Form is valid', data);
}, (errors) => {
  console.log('Validation errors', errors);
});

validator.enableLiveValidation();
```

---

## ⚡ Live Validation

Enable real-time validation on specific events:

```js
validator.enableLiveValidation(['blur', 'change', 'input']);
```

*Default events: blur and change.*

---

## 🔁 Reset Form

You can reset the form and clear errors using:

```js
validator.reset();
```

---

## 🎨 Customizing Errors

### Options:

| Option       | Description                     | Default              |
| ------------ | ------------------------------- | -------------------- |
| errorElement | HTML tag to wrap error messages | `'div'`              |
| errorClass   | CSS class for error messages    | `'validation-error'` |
| errorId      | Template for error element IDs  | `'@{field}-error'`   |

Example:

```js
const validator = FormValidator.init('#myForm', schema, onValid, onError, {
  errorElement: 'span',
  errorClass: 'input-error',
  errorId: 'error-@{field}'
});
```

---

## 📚 Schema Flexibility

### String Format:

```js
name: 'require|minLength(2)|maxLength(20)'
```

### Object Format with Custom Messages:

```js
name: {
  require: true,
  minLength: 2,
  maxLength: 20,
  messages: {
    require: 'Name is required',
    minLength: 'Name must be at least 2 characters',
    maxLength: 'Name must be less than 20 characters'
  }
}
```

---

## 🛠️ Example with Files and Dates

```js
const schema = {
  resume: 'require|maxFiles(1)|maxFileSize(500kb)|fileAccepts(pdf,docx)',
  date_of_birth: 'require|date|dateBefore(2017-01-01)|dateAfter(1990-01-01)',
  portfolio_link: 'optional|url'
};
```

---

## 🔗 Additional Resources

* [Custom Rule Registration](./custom-rules.md)
* [Express.js Plugin Guide](./express.md)
* [Error Formatter Guide](./error-formatter.md)
* [Rules and Processors Reference](./rules-and-processors.md)