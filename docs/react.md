**React Middleware**

This package provides a small React integration for `superform-validator` exposing:

- `validate(schema, values)` — validate a plain values object, returns `{ valid, validated?, errors? }`.
- `useValidator(schema)` — simple hook to run validation and read `errors`, `validated` and `reset`.
- `useForm(schema, options?)` — full-featured form hook inspired by `react-hook-form`.
- `useController({ name, control })` — hook to connect controlled components to `useForm` `control`.

Design goals:
- Lightweight and straightforward API.
- Support nested field names (dot-notation), file inputs, dirty tracking and unregister/watch helpers.

Quick overview

1) validate

```ts
import { validate } from 'superform-validator/react';

const result = await validate(schema, { email: 'a@b.com' });
if (!result.valid) console.log(result.errors);
else console.log(result.validated);
```

2) useValidator

```tsx
const { errors, validated, validate, handleSubmit } = useValidator(schema);

<form onSubmit={handleSubmit(valid => console.log(valid))}>
  {/* fields */}
</form>
```

3) useForm (recommended)

```tsx
const { register, handleSubmit, errors, control, watch } = useForm(schema, { initialValues: {}, validateOnBlur: true });

// register usage for controlled inputs
<input {...register('name')} />

// controller usage
const { field } = useController({ name: 'name', control });
<input {...field} />

// watch & dirty
const current = watch('name');

// unregister
control.unregister('tempField');
```

API details
- `useForm(schema, { initialValues?, validateOnChange?, validateOnBlur? })` returns an object with:
  - `values`, `errors`, `validated`, `touched`, `dirty`
  - `register(name)` — returns `{ name, value, onChange, onBlur }` for inputs (supports nested names)
  - `setFieldValue(name, val)` — programmatic update
  - `handleChange`, `handleBlur` — event handlers
  - `handleSubmit(onValid, onInvalid?)` — returns submit handler for `<form>`
  - `validate()` — manual validation
  - `reset(values?)` — reset form state
  - `control` — object consumed by `useController` with `register`, `setValue`, `getValues`, `unregister`, `watch`, `trigger`, `formState`

Notes & tips
- `dirty` and `isDirty` are computed comparing field value to initial values using a JSON-based deep equality.
- `watch(name)` returns the current value for a nested field (or full values if no name provided). It's synchronous.
- `trigger(name?)` runs validation and returns whether the (optional) field is valid. Currently it runs full form validation internally; it may be optimized in future releases.

See [docs/react-examples.md](./react-examples.md) for runnable examples.
