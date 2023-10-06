import {computed, Injector, isSignal, Signal, WritableSignal} from '@angular/core';
import {DirtyState, FormField, TouchedState} from './form-field';
import {
  computeErrors,
  computeErrorsArray,
  computeState,
  computeValidateState,
  computeValidators,
  InvalidDetails,
  ValidationState,
  Validator,
} from './validation';

export type UnwrappedFormGroup<Controls> = {
  [K in keyof Controls]: Controls[K] extends FormField<infer V>
    ? V
    : Controls[K] extends FormGroup<infer G>
      ? UnwrappedFormGroup<G>
      : never;
};

export type FormGroup<
  Controls extends | { [p: string]: FormField | FormGroup }
    | WritableSignal<any[]> = {}
> = {
  value: Signal<UnwrappedFormGroup<Controls>>;
  controls: { [K in keyof Controls]: Controls[K] };
  valid: Signal<boolean>;
  state: Signal<ValidationState>;
  dirtyState: Signal<DirtyState>;
  touchedState: Signal<TouchedState>;
  errors: Signal<{}>;
  errorsArray: Signal<InvalidDetails[]>;
  markAllAsTouched: () => void;
  reset: () => void;
};

export type FormGroupOptions = {
  validators?: Validator<any>[];
  hidden?: () => boolean;
  disabled?: () => boolean;
};

const markFormControlAsTouched = (f: any) => {
  if (typeof f.markAsTouched === "function") {
    f.markAsTouched();
  }
  if (typeof f.markAllAsTouched === "function") {
    f.markAllAsTouched();
  }
}
export function createFormGroup<
  Controls extends | { [p: string]: FormField | FormGroup }
    | WritableSignal<any[]>
>(
  formGroupCreator: () => Controls,
  options?: FormGroupOptions,
  injector?: Injector
): FormGroup<Controls> {
  const formGroup = formGroupCreator();
  const initialArrayControls =
    typeof formGroup === 'function' && isSignal(formGroup) ? [...formGroup()] : [];

  const valueSignal = computed(() => {
    const fg =
      typeof formGroup === 'function' && isSignal(formGroup)
        ? formGroup()
        : formGroup;

    if (Array.isArray(fg)) {
      return fg.map((f) => f.value());
    }
    return Object.entries(fg).reduce((acc, [key, value]) => {
      (acc as any)[key] = value.value();
      return acc;
    }, {} as any);
  });

  const validatorsSignal = computeValidators(valueSignal, options?.validators, injector);
  const validateStateSignal = computeValidateState(validatorsSignal);

  const errorsSignal = computeErrors(validateStateSignal);
  const errorsArraySignal = computeErrorsArray(validateStateSignal);

  const stateSignal = computeState(validateStateSignal);

  const fgStateSignal = computed(() => {
      const fg =
        typeof formGroup === 'function' && isSignal(formGroup)
          ? formGroup()
          : formGroup;
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

  return {
    value: valueSignal,
    controls: formGroup,
    state: fgStateSignal,
    valid: computed(() => fgStateSignal() === 'VALID'),
    errors: computed(() => {
      return errorsSignal();
    }),
    errorsArray: computed(() => {
      const myErrors = errorsArraySignal();
      const fg =
        typeof formGroup === 'function' && isSignal(formGroup)
          ? formGroup()
          : formGroup;
      const childErrors = Object.entries(fg).map(([key, f]) => {
        return (f as any)
          .errorsArray()
          .map((e: any) => ({...e, path: e.path ? key + '.' + e.path : key}));
      });
      return myErrors.concat(...childErrors);
    }),
    dirtyState: computed(() => {
      const fg =
        typeof formGroup === 'function' && isSignal(formGroup)
          ? formGroup()
          : formGroup;

      const states = Object.values(fg).map((f) => f.dirtyState());

      const isDirty = states.some((e) => e === 'DIRTY');
      if (isDirty) {
        return 'DIRTY';
      }

      return 'PRISTINE';
    }),
    touchedState: computed(() => {
      const fg =
        typeof formGroup === 'function' && isSignal(formGroup)
          ? formGroup()
          : formGroup;

      const states = Object.values(fg).map((f) => f.touchedState());

      const isTouched = states.some((e) => e === 'TOUCHED');
      if (isTouched) {
        return 'TOUCHED';
      }

      return 'UNTOUCHED';
    }),
    markAllAsTouched: () => {
      const fg =
        typeof formGroup === 'function' && isSignal(formGroup)
          ? formGroup()
          : formGroup;

      if (Array.isArray(fg)) {
        fg.forEach(f => markFormControlAsTouched(f))
        return;
      }
      Object.values(fg).forEach(f => markFormControlAsTouched(f))
    },
    reset: () => {
      const fg =
        typeof formGroup === 'function' && isSignal(formGroup)
          ? formGroup()
          : formGroup;

      if (Array.isArray(fg)) {
        // need to create new array to set so change is not swallowed by equality of objects
        (formGroup as WritableSignal<any[]>).set([...initialArrayControls]);
        return;
      }
      return Object.values(fg).forEach(f => {
        f.reset()
      })
    },
  };
}
