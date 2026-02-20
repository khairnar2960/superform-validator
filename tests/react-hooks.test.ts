/* @vitest-environment jsdom */
import React, { useEffect } from 'react';
import { render, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { validate, useForm, useController } from '../src/middlewares/react';

describe('React middleware hooks', () => {
    it('validate() returns errors for invalid data and validated for valid data', async () => {
        const schema = { name: 'require' } as any;

        const res1 = await validate(schema, {});
        expect(res1.valid).toBe(false);
        expect(res1.errors).toBeTruthy();

        const res3 = await validate({ name: { require: true, noEmpty: true }}, { name: '' });
        expect(res3.valid).toBe(false);
        expect(res3.errors).toBeTruthy();

        const res2 = await validate(schema, { name: 'Alice' });
        expect(res2.valid).toBe(true);
        expect(res2.validated).toBeTruthy();
        expect((res2.validated as any).name).toBe('Alice');
    });

    it('useForm: register, setFieldValue, validate, dirty and unregister/watch work', async () => {
        const schema = { 'profile.name': 'require' } as any;

        let api: any = null;

        function Tester() {
            const form = useForm(schema, { initialValues: { profile: { name: '' } } });
            useEffect(() => {
                api = form;
            }, [form]);
            return null;
        }

        render(React.createElement(Tester));

        // initial state
        expect(api).toBeTruthy();
        expect(api.values.profile?.name).toBe('');
        // set value
        await act(async () => {
            await api.setFieldValue('profile.name', 'Bob');
        });
        expect(api.values.profile.name).toBe('Bob');
        // dirty flag
        expect(api.control.formState.dirty['profile.name']).toBe(false);
        // validate
        const res = await api.validate();

        expect(res.valid).toBe(false);
        // unregister
        api.unregister('profile.name');
        expect(api.watch('profile.name')).toBeUndefined();
    });

    it('useController binds field to control and updates form values', async () => {
        const schema = { 'user.email': 'require|email' } as any;
        let exposed: any = null;

        function Tester() {
            const form = useForm(schema, { initialValues: { user: { email: '' } } });
            const controller = useController({ name: 'user.email' as any, control: form.control as any });
            useEffect(() => {
                exposed = { form, controller };
            }, [form, controller]);
            return null;
        }

        render(React.createElement(Tester));
        expect(exposed).toBeTruthy();
        const { form, controller } = exposed;

        // simulate change via controller.field.onChange with event
        await act(async () => {
            controller.field.onChange({ target: { type: 'text', name: 'user.email', value: 'not-an-email' } });
            // small delay to let state update
        });

        expect(form.watch('user.email')).toBe('not-an-email');
        expect(controller.fieldState.isDirty).toBe(false);

        // validate invalid email
        const result = await form.validate();
        expect(result.valid).toBe(false);
        expect(form.control.formState.errors['user.email']).toBeFalsy();
    });
});
