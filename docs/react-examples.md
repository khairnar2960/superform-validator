**React Middleware — Examples**

This document demonstrates simple usage examples for the React middleware.

Files in `examples/`:

- `react-basic.tsx` — simple controlled form using `useForm` and `register`.
- `react-controller.tsx` — controlled example using `useController` and `control`.

Example: [examples/react-basic.tsx](../examples/react-basic.tsx)

```tsx
import { useForm } from 'superform-validator/react';

const schema = {
  email: 'required|email',
  age: 'integer|minInt(1)',
};

export default function BasicForm() {
  const { register, handleSubmit, errors } = useForm(schema, { initialValues: { email: '', age: '' } });

  return (
    <form onSubmit={handleSubmit((data) => console.log('valid', data), (errs) => console.log('invalid', errs))}>
      <label>
        Email
        <input {...register('email')} />
      </label>
      {errors.email && <div className="error">{errors.email}</div>}

      <label>
        Age
        <input {...register('age')} />
      </label>
      {errors.age && <div className="error">{errors.age}</div>}

      <button type="submit">Submit</button>
    </form>
  );
}
```

Example: [examples/react-controller.tsx](../examples/react-controller.tsx)

```tsx
import { useForm, useController } from 'superform-validator/react';

const schema = {
  name: 'required',
  phone: 'string'
};

export default function ControllerForm() {
  const { control, handleSubmit } = useForm(schema, { initialValues: { name: '', phone: '' } });

  const nameController = useController({ name: 'name', control });

  return (
    <form onSubmit={handleSubmit((data) => console.log('validated', data))}>
      <input {...nameController.field} placeholder="Full name" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

To try these examples in a React app, copy the files into your project and import the default component into a route or root App.
