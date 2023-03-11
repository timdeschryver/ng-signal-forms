import {effect, isSignal, SettableSignal, signal, Signal,} from '@angular/core';
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

export type DirtyState = 'PRISTINE' | 'DIRTY';
export type TouchedState = 'TOUCHED' | 'UNTOUCHED';

export type FormField<Value = unknown> = {
  value: SettableSignal<Value>;
  errors: Signal<{}>;
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

export function createFormField<Value>(
  value: Value | SettableSignal<Value>,
  options?: FormFieldOptions
): FormField<Value> {
  const valueSignal =
    typeof value === 'function' && isSignal(value) ? value : signal(value);

  const validatorsSignal = computeValidators(valueSignal, options?.validators);
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

  if (options?.hidden) {
    effect(() => {
      hiddenSignal.set(options!.hidden!());
    });
  }

  if (options?.disabled) {
    effect(() => {
      disabledSignal.set(options!.disabled!());
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
