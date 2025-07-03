# 🧩 ErrorFormatter

A lightweight, expressive template engine for formatting error (or any custom) messages using dynamic placeholders.
Supports nested object paths, array access, chained fallbacks, and powerful string transformation hooks.

---

## ✨ Features

* ✅ Dynamic placeholder resolution using `@{...}` syntax
* 🧬 Supports:

  - Nested properties: `@{user.name}`
  - Array indices: `@{items[0]}`
  - Mixed notation: `@{config[env].mode}`
* 🛡 Fallback chaining using `||`:

  - Supports paths and literals: `@{user.name || user.username || 'Guest'}`
* 🎛️ String modifiers:

  - `trim`, `upper`, `lower`, `capitalize`
  - Example: `@{user.name | upper}`
* 🔒 Safe handling of missing or invalid paths

---

## 🚀 Usage

### 📌 Basic Example

```ts
const template = 'User @{user.name} has roles: @{user.roles} and lives in @{user.address.city}.';
const placeholders = {
	user: {
		name: 'John',
		roles: ['Admin', 'Editor'],
		address: { city: 'Mumbai' },
	},
};

const message = ErrorFormatter.format(template, placeholders);
console.log(message);
// Output: "User John has roles: Admin, Editor and lives in Mumbai."
```

👉 Arrays are automatically joined with `, ` for ease.

---

### 📌 Fallbacks with Modifiers

```ts
const template = "Welcome @{user.name || user.username | upper || 'Guest'}! You have @{user.notifications.length || 0} new messages.";
const placeholders = {
	user: {
		username: 'johndoe',
		notifications: ['Ping!', 'Alert!']
		// name is missing
	}
};

const message = ErrorFormatter.format(template, placeholders);
console.log(message);
// Output: "Welcome JOHNDOE! You have 2 new messages."
```

---

### 📌 String Modifiers in Action

```ts
const template = "Hello, @{user.name | trim | capitalize}!";
const placeholders = {
	user: { name: '   sameer' }
};

const message = ErrorFormatter.format(template, placeholders);
console.log(message);
// Output: "Hello, Sameer!"
```

---

## 📘 Use Cases

| Scenario                          | Example Template                                        | Result Output                  |
| --------------------------------- | ------------------------------------------------------- | ------------------------------ |
| Basic user greeting               | `Hello, @{user.name}!`                                  | `Hello, Aanya!`                |
| Missing value with default        | `Hello, @{user.name \|\| 'Guest'}`                      | `Hello, Guest`                 |
| Array access                      | `First item: @{items[0]}`                               | `First item: Banana`           |
| Deep object resolution            | `Country: @{user.address.country}`                      | `Country: India`               |
| Combined indexing & fallback      | `@{user.roles[1] \|\| 'No role assigned'}`              | `editor` or `No role assigned` |
| Message count with fallback       | `@{user.notifications.length \|\| 0} new notifications` | `3 new notifications`          |
| Chained fallback with object path | `@{user.name \|\| user.username \|\| 'Guest'}`          | `Guest` or `username value`    |
| Modifiers with fallback           | `@{user.name \|\| user.username \| upper \|\| 'Guest'}` | `JOHNDOE` or `Guest`           |
| Multiple string modifiers         | `@{user.name \| trim \| capitalize}`                    | `Ravi` (if value is `' ravi'`) |

---

## 🧩 Template Syntax Reference

| Syntax                               | Description                                  |
| ------------------------------------ | -------------------------------------------- |
| `@{field}`                           | Resolves a direct property                   |
| `@{user.name}`                       | Access nested object property                |
| `@{items[0]}`                        | Array index resolution                       |
| `@{user.name \|\| 'Guest'}`          | Fallback/default value                       |
| `@{user.name \|\| user.username}`    | Fallback to another object path              |
| `@{user.name \| upper}`              | Apply `upper` modifier to the resolved value |
| `@{user.name \| trim \| capitalize}` | Apply multiple string modifiers              |
| `@{field[alt]}`                      | Equivalent to `field.alt`                    |

---

## 🔧 Supported String Modifiers

| Modifier     | Description              |
| ------------ | ------------------------ |
| `trim`       | Trims whitespace         |
| `upper`      | Converts to uppercase    |
| `lower`      | Converts to lowercase    |
| `capitalize` | Capitalizes first letter |

---

## 🔥 Advanced Notes

* ✅ Multiple fallback candidates are fully supported.
* ✅ Modifiers are applied **per fallback candidate**.
* ✅ Arrays are automatically joined as comma-separated strings.
* ✅ Missing or malformed paths are handled safely (returns empty string).
* ✅ Supports complex expressions like:
  `@{user.name | trim | capitalize || user.username | upper || 'Guest'}`