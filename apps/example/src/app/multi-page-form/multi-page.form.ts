import {
  V,
  createFormField,
  createFormGroup,
  createInjectableSignalForm,
} from '@ng-signal-forms';
import { signal } from '@angular/core';

export const { injectSignalForm, provideSignalForm } =
  createInjectableSignalForm(() =>
    createFormGroup(() => ({
      step1: createFormGroup(() => ({
        firstName: createFormField('', { validators: [V.required()] }),
        lastName: createFormField('', { validators: [V.required()] }),
      })),
      step2: createFormGroup(() => ({
        street: createFormField('', { validators: [V.required()] }),
        zip: createFormField<number | undefined>(undefined, {
          validators: [V.required(), V.equalsTo(signal(1234))],
        }),
        city: createFormField('', { validators: [V.required()] }),
        country: createFormField('', { validators: [V.required()] }),
      })),
    }))
  );
