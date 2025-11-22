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