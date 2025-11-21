import React from 'react';
import { useForm, useController } from '../src/middlewares/react';

const schema = { 'profile.name': 'required', 'profile.phone': 'string' };

export default function ControllerForm() {
  const { control, handleSubmit } = useForm(schema, { initialValues: { profile: { name: '', phone: '' } } });

  const nameController = useController({ name: 'profile.name' as any, control: control as any });

  return (
    <form onSubmit={handleSubmit((data) => console.log('validated', data))}>
      <input {...nameController.field} placeholder="Full name" />
      <button type="submit">Submit</button>
    </form>
  );
}
