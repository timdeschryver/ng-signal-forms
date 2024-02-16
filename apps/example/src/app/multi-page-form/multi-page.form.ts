import { createFormField, createFormGroup, createInjectableSignalForm, equalsTo, required } from '@ng-signal-forms';

export const { injectSignalForm, provideSignalForm } =
  createInjectableSignalForm(() =>
    createFormGroup(() => ({
      step1: createFormGroup(() => ({
        firstName: createFormField('', { validators: [required()] }),
        lastName: createFormField('', { validators: [required()] }),
      })),
      step2: createFormGroup(() => ({
        street: createFormField('', { validators: [required()] }),
        zip: createFormField<number | undefined>(undefined, {
          validators: [required(), equalsTo(1234)],
        }),
        city: createFormField('', { validators: [required()] }),
        country: createFormField('', { validators: [required()] }),
      })),
    }))
  );
