import {
  computed,
  Injector,
  isSignal,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { createFormField, DirtyState, TouchedState } from './form-field';
import {
  computeErrors,
  computeErrorsArray,
  computeState,
  computeValidateState,
  computeValidators,
  hasValidator,
  InvalidDetails,
  ValidationState,
  Validator,
} from './validation';
import {
  FormGroupCreator,
  UnwrappedFormGroup,
  FormGroupFields,
  FormGroupCreatorOrSignal,
} from './models';

export type FormGroup<Fields extends FormGroupCreatorOrSignal = {}> = {
  __type: 'FormGroup';
  value: Signal<UnwrappedFormGroup<Fields>>;
  controls: Fields extends WritableSignal<FormGroup<infer G>[]>
    ? FormGroupFields<Fields> & WritableSignal<FormGroup<G>[]>
    : Fields extends WritableSignal<infer F>
    ? FormGroupFields<Fields> & WritableSignal<F>
    : FormGroupFields<Fields>;
  valid: Signal<boolean>;
  state: Signal<ValidationState>;
  dirtyState: Signal<DirtyState>;
  dirty: Signal<boolean>;
  touchedState: Signal<TouchedState>;
  touched: Signal<boolean>;
  errors: Signal<{}>;
  errorsArray: Signal<InvalidDetails[]>;
  hasError: (errorKey: string) => boolean;
  hasValidator: (validator: Validator) => boolean;
  errorMessage: (errorKey: string) => string | undefined;
  markAllAsTouched: () => void;
  reset: () => void;
};

export type FormGroupOptions = {
  validators?: Validator<any>[];
  hidden?: () => boolean;
  disabled?: () => boolean;
};

const markFormControlAsTouched = (f: any) => {
  if (typeof f.markAsTouched === 'function') {
    f.markAsTouched();
  }
  if (typeof f.markAllAsTouched === 'function') {
    f.markAllAsTouched();
  }
};
export function createFormGroup<FormFields extends FormGroupCreator>(
  formGroupCreator: FormFields | (() => FormFields),
  options?: FormGroupOptions,
  injector?: Injector
): FormGroup<FormFields> {
  const formGroup: FormFields =
    typeof formGroupCreator === 'function'
      ? formGroupCreator()
      : formGroupCreator;

  const formFieldsMapOrSignal = Array.isArray(formGroup)
    ? signal(formGroup as any[])
    : Object.entries(formGroup).reduce((acc, [key, value]: [string, any]) => {
        (acc as any)[key] =
          value?.__type === 'FormGroup' || value?.__type === 'FormField'
            ? value
            : createFormField(value);
        return acc;
      }, {} as FormGroupFields<FormFields>);

  const initialArrayControls = isSignal(formFieldsMapOrSignal)
    ? [...formFieldsMapOrSignal()]
    : [];

  const valueSignal = computed(() => {
    const fg = isSignal(formFieldsMapOrSignal)
      ? formFieldsMapOrSignal()
      : formFieldsMapOrSignal;

    if (Array.isArray(fg)) {
      return fg.map((f) => f.value());
    }
    return Object.entries(fg).reduce((acc, [key, value]) => {
      (acc as any)[key] = value.value();
      return acc;
    }, {} as any);
  });
  const validatorsSignal = computeValidators(
    valueSignal,
    options?.validators,
    injector
  );
  const validateStateSignal = computeValidateState(validatorsSignal);

  const errorsSignal = computeErrors(validateStateSignal);
  const errorsArraySignal = computeErrorsArray(validateStateSignal);

  const stateSignal = computeState(validateStateSignal);

  const fgStateSignal = computed(() => {
    const fg = isSignal(formFieldsMapOrSignal)
      ? formFieldsMapOrSignal()
      : formFieldsMapOrSignal;
    const states = Object.values(fg)
      .map((field) => field.state())
      .concat(stateSignal());
    if (states.some((state) => state === 'INVALID')) {
      return 'INVALID';
    }
    if (states.some((state) => state === 'PENDING')) {
      return 'PENDING';
    }
    return 'VALID';
  });

  const dirtyStateSignal = computed(() => {
    const fg = isSignal(formFieldsMapOrSignal)
      ? formFieldsMapOrSignal()
      : formFieldsMapOrSignal;

    const states = Object.values(fg).map((f) => f.dirtyState());

    const isDirty = states.some((e) => e === 'DIRTY');
    if (isDirty) {
      return 'DIRTY';
    }

    return 'PRISTINE';
  })
  const dirtySignal = computed(() => dirtyStateSignal() === 'DIRTY');

  const touchedStateSignal = computed(() => {
    const fg = isSignal(formFieldsMapOrSignal)
      ? formFieldsMapOrSignal()
      : formFieldsMapOrSignal;

    const states = Object.values(fg).map((f) => f.touchedState());

    const isTouched = states.some((e) => e === 'TOUCHED');
    if (isTouched) {
      return 'TOUCHED';
    }

    return 'UNTOUCHED';
  })
  const touchedSignal = computed(() => touchedStateSignal() === 'TOUCHED');

  return {
    __type: 'FormGroup',
    value: valueSignal,
    controls: formFieldsMapOrSignal as any,
    state: fgStateSignal,
    valid: computed(() => fgStateSignal() === 'VALID'),
    errors: computed(() => {
      return errorsSignal();
    }),
    errorsArray: computed(() => {
      const myErrors = errorsArraySignal();
      const fg = isSignal(formFieldsMapOrSignal)
        ? formFieldsMapOrSignal()
        : formFieldsMapOrSignal;
      const childErrors = Object.entries(fg).map(([key, f]) => {
        return (f as any)
          .errorsArray()
          .map((e: any) => ({ ...e, path: e.path ? key + '.' + e.path : key }));
      });
      return myErrors.concat(...childErrors);
    }),
    hasError: (errorKey: string) => !!errorsSignal()[errorKey],
    hasValidator: (validator: Validator) => {
      if (options !== undefined) {
        return hasValidator(options.validators, validator);
      } else {
        return false;
      }
    },
    errorMessage: (errorKey: string) => errorsArraySignal().find(e => e.key === errorKey)?.message,
    dirtyState: dirtyStateSignal,
    dirty: dirtySignal,
    touchedState: touchedStateSignal,
    touched: touchedSignal,
    markAllAsTouched: () => {
      const fg = isSignal(formFieldsMapOrSignal)
        ? formFieldsMapOrSignal()
        : formFieldsMapOrSignal;

      if (Array.isArray(fg)) {
        fg.forEach((f) => markFormControlAsTouched(f));
        return;
      }
      Object.values(fg).forEach((f) => markFormControlAsTouched(f));
    },
    reset: () => {
      const fg = isSignal(formFieldsMapOrSignal)
        ? formFieldsMapOrSignal()
        : formFieldsMapOrSignal;

      if (Array.isArray(fg)) {
        // need to create new array to set so change is not swallowed by equality of objects
        (formFieldsMapOrSignal as WritableSignal<any[]>).set([
          ...initialArrayControls,
        ]);

        for (const ctrl of initialArrayControls) {
          ctrl.reset();
        }
        return;
      }
      return Object.values(fg).forEach((f) => {
        f.reset();
      });
    },
  };
}
