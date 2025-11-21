import React from 'react';
import { useForm } from '../src/middlewares/react';

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
        <input {...register('email' as any)} />
      </label>
      {errors.email && <div className="error">{errors.email}</div>}

      <label>
        Age
        <input {...register('age' as any)} />
      </label>
      {errors.age && <div className="error">{errors.age}</div>}

      <button type="submit">Submit</button>
    </form>
  );
}
