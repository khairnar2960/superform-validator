**React Middleware — Examples**

This document demonstrates simple usage examples for the React middleware.

Files in `examples/`:

- `react-basic.tsx` — simple controlled form using `useForm` and `register`.
- `react-controller.tsx` — controlled example using `useController` and `control`.

Example: `examples/react-basic.tsx`

```tsx
import React from 'react';
import { useForm } from 'superform-validator/middlewares/react';

const schema = {
  email: 'required|email',
  age: 'integer|min:1',
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

Example: `examples/react-controller.tsx`

```tsx
import React from 'react';
import { useForm, useController } from 'superform-validator/middlewares/react';

const schema = { 'profile.name': 'required', 'profile.phone': 'string' };

export default function ControllerForm() {
  const { control, handleSubmit } = useForm(schema, { initialValues: { profile: { name: '', phone: '' } } });

  const nameController = useController({ name: 'profile.name', control });

  return (
    <form onSubmit={handleSubmit((data) => console.log('validated', data))}>
      <input {...nameController.field} placeholder="Full name" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

To try these examples in a React app, copy the files into your project and import the default component into a route or root App.
