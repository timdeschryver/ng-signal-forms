import {effect, isSignal, signal, Signal, WritableSignal} from '@angular/core';
import {
  computeErrors,
  computeErrorsArray,
  computeState,
  computeValidateState,
  computeValidators,
  InvalidDetails,
  ValidationErrors,
  ValidationState,
  Validator,
} from './validation';

export type DirtyState = 'PRISTINE' | 'DIRTY';
export type TouchedState = 'TOUCHED' | 'UNTOUCHED';

export type FormField<Value = unknown> = {
  value: WritableSignal<Value>;
  errors: Signal<ValidationErrors>;
  errorsArray: Signal<InvalidDetails[]>;
  state: Signal<ValidationState>;
  dirtyState: Signal<DirtyState>;
  touchedState: Signal<TouchedState>;
  hidden: Signal<boolean>;
  disabled: Signal<boolean>;
  markAsTouched: () => void;
  markAsDirty: () => void;
};

export type FormFieldOptions = {
  validators?: Validator<any>[];
  hidden?: () => boolean;
  disabled?: () => boolean;
};
export type FormFieldOptionsCreator<T> = (value: Signal<T>) => FormFieldOptions

export function createFormField<Value>(
  value: Value | WritableSignal<Value>,
  options?: FormFieldOptions | FormFieldOptionsCreator<Value>
): FormField<Value> {
  const valueSignal =
    // needed until types for writable signal are fixed
    (typeof value === 'function' && isSignal(value) ? value : signal(value)) as WritableSignal<Value>;
  const finalOptions = options && typeof options === 'function' ? options(valueSignal) : options;

  const validatorsSignal = computeValidators(valueSignal, finalOptions?.validators);
  const validateStateSignal = computeValidateState(validatorsSignal);

  const errorsSignal = computeErrors(validateStateSignal);
  const errorsArraySignal = computeErrorsArray(validateStateSignal);

  const stateSignal = computeState(validateStateSignal);

  const touchedSignal = signal<TouchedState>('UNTOUCHED');
  const dirtySignal = signal<DirtyState>('PRISTINE');
  const hiddenSignal = signal(false);
  const disabledSignal = signal(false);

  effect(() => {
    if (valueSignal()) {
      dirtySignal.set('DIRTY');
    }
  });

  if (finalOptions?.hidden) {
    effect(() => {
      hiddenSignal.set(finalOptions!.hidden!());
    });
  }

  if (finalOptions?.disabled) {
    effect(() => {
      disabledSignal.set(finalOptions!.disabled!());
    });
  }

  return {
    value: valueSignal,
    errors: errorsSignal,
    errorsArray: errorsArraySignal,
    state: stateSignal,
    touchedState: touchedSignal,
    dirtyState: dirtySignal,
    hidden: hiddenSignal,
    disabled: disabledSignal,
    markAsTouched: () => touchedSignal.set('TOUCHED'),
    markAsDirty: () => dirtySignal.set('DIRTY'),
  };
}
