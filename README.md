# 📦 **SuperForm Validator**

A powerful and flexible JavaScript form validator for native HTML forms.

![npm](https://img.shields.io/npm/v/superform-validator) ![npm bundle size (version)](https://img.shields.io/bundlephobia/min/superform-validator/1.0.3) ![GitHub release (by tag)](https://img.shields.io/github/downloads/khairnar2960/superform-validator/stable/total) ![jsDelivr hits (npm)](https://img.shields.io/jsdelivr/npm/hy/superform-validator) ![npm](https://img.shields.io/npm/dy/superform-validator) ![GitHub issues](https://img.shields.io/github/issues-raw/khairnar2960/superform-validator) ![GitHub closed issues](https://img.shields.io/github/issues-closed-raw/khairnar2960/superform-validator)

---

## 🚀 Features

* ✅ Native HTML form validation
* ✅ Custom rules and messages per field
* ✅ Live validation on `blur` and `change`
* ✅ File input validation (max files, size, types)
* ✅ Type casting (string, number, boolean, case conversions)
* ✅ Auto-scroll to the first error
* ✅ Custom error display element and CSS class
* ✅ Easy reset and form clearing

---

## Installation

To use FormValidator include `form-validator.js` just above closing body tag into html

```html
  <script src="form-validator.js"></script>
```
OR use jsDeliver CDN

```html
  <script src="https://cdn.jsdelivr.net/npm/superform-validator@1.0.3/dist/form-validator.js"></script>
```
OR use unpkg CDN

```html
  <script src="https://unpkg.com/superform-validator@1.0.3/dist/form-validator.js"></script>
```

---

## 🛠️ Initialization

```js
const validator = FormValidator.init('#myForm', schema, onValid, onError, options);
```

---

### Parameters:

| Parameter | Type                  | Description                                 |
| --------- | --------------------- | ------------------------------------------- |
| `form`    | String or DOM Element | Form selector or DOM reference              |
| `schema`  | Object                | Validation rules and casting for each field |
| `onValid` | Function              | Callback when validation passes             |
| `onError` | Function              | Callback when validation fails              |
| `options` | Object                | Optional: custom error element and class    |

---

## ⚙️ Options

| Option         | Type   | Default              | Description                               |
| -------------- | ------ | -------------------- | ----------------------------------------- |
| `errorElement` | String | `'div'`              | HTML element to display error messages    |
| `errorClass`   | String | `'validation-error'` | CSS class for error elements              |
| `errorId`      | String | `'@{field}-error'`   | Field id name template for error elements |

---

## 📚 Supported Rules

### 📝 Basic Rules

| Rule            | Syntax                    | Description                             |
| --------------- | ------------------------- | --------------------------------------- |
| `require`       | `require`                 | Field must not be empty                 |
| `minLength`     | `minLength::int`          | Minimum number of characters            |
| `maxLength`     | `maxLength::int`          | Maximum number of characters            |
| `length`        | `length::int`             | Exact length                            |
| `email`         | `email`                   | Valid email address                     |
| `pincode`       | `pincode`                 | Indian PIN code                         |
| `pan`           | `pan`                     | Indian PAN card format                  |
| `ifsc`          | `ifsc`                    | Indian IFSC code                        |
| `alpha`         | `alpha`                   | Only alphabets                          |
| `alphaspace`    | `alphaspace`              | Alphabets and spaces                    |
| `alphanum`      | `alphanum`                | Alphabets and numbers                   |
| `alphanumspace` | `alphanumspace`           | Alphabets, numbers, spaces              |
| `slug`          | `slug`                    | Valid slug                              |
| `decimal`       | `decimal`                 | Decimal number                          |
| `numeric`       | `numeric`                 | Integer & Decimal both number           |
| `integer`       | `integer`                 | Integer number                          |
| `mobile`        | `mobile`                  | Indian mobile number                    |
| `date`          | `date`                    | Date in format YYYY-MM-DD               |
| `time`          | `time`                    | Time in format HH:MM:SS                 |
| `url`           | `url`                     | Web URL                                 |
| `match`         | `match::otherFieldName`   | Must match another field                |
| `in`            | `in::val1,val2`           | Value must be in provided list          |
| `notIn`         | `notIn::val1,val2`        | Value must not be in provided list      |
| `eq`            | `eq::value`               | Must be equal to provided value         |
| `notEq`         | `notEq::value`            | Must not be equal to provided value     |
| `gt`            | `gt::value`               | Greater than provided value             |
| `gte`           | `gte::value`              | Greater than or equal to provided value |
| `lt`            | `lt::value`               | Less than provided value                |
| `lte`           | `lte::value`              | Less than or equal to provided value    |
| `contains`      | `contains::text`          | Must contain provided text              |
| `notContains`   | `notContains::text`       | Must not contain provided text          |
| `startsWith`    | `startsWith::text`        | Must start with provided text           |
| `notStartsWith` | `notStartsWith::text`     | Must not start with provided text       |
| `endsWith`      | `endsWith::text`          | Must end with provided text             |
| `notEndsWith`   | `notEndsWith::text`       | Must not end with provided text         |

---

### 📂 File Rules

| Rule             | Syntax                                  | Description                                 |
| ---------------- | --------------------------------------- | ------------------------------------------- |
| `file::maxFiles` | `file::maxFiles(int)`                   | Maximum number of files                     |
| `file::maxSize`  | `file::maxSize(2MB)`                    | Maximum file size (supports KB, MB, GB, TB) |
| `file::accepts`  | `file::accepts(jpg\|png\|image/jpeg)`   | Allowed file extensions or MIME types       |

---

### 🔧 Custom Rules

```js
FormValidator.registerRule('isEven', (value) => parseInt(value) % 2 === 0, 'Value must be even');
```

---

### 🧪 Custom Regex Example

```js
const schema = {
  username: {
    custom: {
      pattern: /^[a-zA-Z0-9_]{5,15}$/,
      message: 'Username must be 5-15 characters and alphanumeric'
    }
  }
};
```

---

### 🔄 Casting Rules

| Cast         | Description             |
| ------------ | ----------------------- |
| `trim`       | Removes whitespace      |
| `integer`    | Casts to integer        |
| `float`      | Casts to float          |
| `boolean`    | Casts to boolean        |
| `lowercase`  | Converts to lowercase   |
| `uppercase`  | Converts to uppercase   |
| `snakecase`  | Converts to snake\_case |
| `kebabcase`  | Converts to kebab-case  |
| `camelcase`  | Converts to camelCase   |
| `pascalcase` | Converts to PascalCase  |
| `titlecase`  | Converts to Title Case  |

---

## Usage

### HTML Form Mode

```html
<form id="myForm">
  <input name="name" required />
  <input name="email" type="email" required />
  <button type="submit">Submit</button>
</form>
```

```javascript
const validator = FormValidator.init('#myForm', {
  name: 'require|minLength::2',
  email: 'require|email',
});

validator.enableLiveValidation();
```

## Example Schemas

```js
const schema = {
  name: 'require|minLength::2|maxLength::50',
  email: {
    require: true,
    email: true,
    messages: {
      require: 'Email is mandatory.',
      email: 'Please enter a valid email address.'
    }
  }
}
```

---

## 🔁 Useful Methods

| Method                                              | Description                                   |
| --------------------------------------------------- | --------------------------------------------- |
| `validate()`                                        | Validate the entire form                      |
| `validateField(fieldName)`                          | Validate a single field                       |
| `reset()`                                           | Reset the form and clear errors               |
| `enableLiveValidation(eventsArray)`                 | Enable live validation on `blur` and `change` |
| static `registerRule(name, callback, message)`      | Add your own validation rule                  |

---

## 🎯 Example: Full Options

```js
const validator = FormValidator.init('#myForm', {
  username: 'require|minLength::3|alphanum',
  password: {
    require: true,
    minLength: 6,
    messages: { minLength: 'Password must be at least 6 characters' },
    cast: 'trim'
  },
  profilePic: 'file::maxFiles(1)|file::accepts(jpg|png)'
}, (data) => {
  console.log('Form Valid!', data);
}, (errors) => {
  console.log('Form Errors', errors);
}, {
  errorElement: 'span',
  errorClass: 'input-error'
});

validator.enableLiveValidation();
```

---

## 💬 Validation Message Templates

SuperForm Validator allows **dynamic error messages** using placeholders within message templates.

### 🔹 **Template Format:**

```text
@{placeholder}
```

### 🔹 **Available Placeholders:**

| Placeholder    | Description                                               |
| -------------- | --------------------------------------------------------- |
| `@{field}`     | The formatted field name (auto-converted to Title Case)   |
| `@{value}`     | The actual input value                                    |
| `@{length}`    | Length parameter for minLength, maxLength, length rules   |
| `@{listItems}` | For `in` or `notIn` rules: the allowed list               |
| `@{other}`     | The compared value or label (for match, eq, gt, lt, etc.) |
| `@{limit}`     | Used in file rules for max files or size                  |
| `@{types}`     | Allowed file types for file::accepts                      |

---

## ✅ Example: Default Template Usage

```js
const schema = {
  password: {
    require: true,
    minLength: 8 // Uses default message: "Minimum length is @{length}"
  }
}
```

If user enters a 5-character password, the displayed message will be:

```text
Minimum length is 8
```

---

## ✅ Example: Custom Template Message

```js
const schema = {
  password: {
    require: true,
    minLength: {
      rule: 8,
      message: '@{field} must be at least @{length} characters long'
    }
  }
};
```

If user enters "abc", the displayed message will be:

```text
Password must be at least 8 characters long
```

---

## ✅ Example: File Rule Template

```js
const schema = {
  profilePic: 'file::maxFiles(1)|file::accepts(jpg|png)'
}
```

If user uploads a `.pdf` file, the displayed message will be:

```text
Invalid file type. Only (jpg, png) allowed
```

✔️ The `@{types}` placeholder is replaced automatically.

---

## ✅ Example: Field-Level Messages

You can override messages per field like this:

```js
const schema = {
  email: {
    require: true,
    email: true,
    messages: {
      require: 'Email is mandatory',
      email: 'Please enter a valid email'
    }
  }
}
```

✔️ **Priority:**
> Field message > Inline message > Default system message

---

## 📌 Summary: Message Template Power

* ✅ Clean, reusable, and consistent.
* ✅ Easy to localize in the future.
* ✅ Fully customizable per rule or per field.

---

## 📜 License

Released under the [MIT License](LICENSE)

---

## 👨‍💻 Author
Made with ❤️ by **Harshal Khairnar**  
Founder, [Hitraa Technologies](https://hitraa.com)  
📧 [harshal@hitraa.com](mailto:harshal@hitraa.com)