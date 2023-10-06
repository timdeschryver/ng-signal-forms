import {computed, effect, Injector, isSignal, signal, Signal, WritableSignal} from '@angular/core';
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
  valid: Signal<boolean>;
  dirtyState: Signal<DirtyState>;
  touchedState: Signal<TouchedState>;
  hidden: Signal<boolean>;
  disabled: Signal<boolean>;
  markAsTouched: () => void;
  markAsDirty: () => void;
  reset: () => void;
  registerOnReset: (fn: (value: Value) => void) => void
};

export type FormFieldOptions = {
  validators?: Validator<any>[];
  hidden?: () => boolean;
  disabled?: () => boolean;
};
export type FormFieldOptionsCreator<T> = (value: Signal<T>) => FormFieldOptions

export function createFormField<Value>(
  value: Value | WritableSignal<Value>,
  options?: FormFieldOptions | FormFieldOptionsCreator<Value>,
  injector?: Injector
): FormField<Value> {
  const valueSignal =
    // needed until types for writable signal are fixed
    (typeof value === 'function' && isSignal(value) ? value : signal(value)) as WritableSignal<Value>;
  const finalOptions = options && typeof options === 'function' ? options(valueSignal) : options;

  const validatorsSignal = computeValidators(valueSignal, finalOptions?.validators, injector);
  const validateStateSignal = computeValidateState(validatorsSignal);

  const errorsSignal = computeErrors(validateStateSignal);
  const errorsArraySignal = computeErrorsArray(validateStateSignal);

  const stateSignal = computeState(validateStateSignal);
  const validSignal = computed(() => stateSignal() === 'VALID')

  const touchedSignal = signal<TouchedState>('UNTOUCHED');
  const dirtySignal = signal<DirtyState>('PRISTINE');
  const hiddenSignal = signal(false);
  const disabledSignal = signal(false);

  effect(() => {
    if (valueSignal()) {
      dirtySignal.set('DIRTY');
    }
  }, {
    allowSignalWrites: true,
    injector: injector
  });

  if (finalOptions?.hidden) {
    effect(() => {
        hiddenSignal.set(finalOptions!.hidden!());
      },
      {
        allowSignalWrites: true,
        injector: injector
      });
  }

  if (finalOptions?.disabled) {
    effect(() => {
        disabledSignal.set(finalOptions!.disabled!());
      },
      {
        allowSignalWrites: true,
        injector: injector
      });
  }

  const defaultValue = typeof value === 'function' && isSignal(value) ? value() :value;
  let onReset = (value: Value) => {}

  return {
    value: valueSignal,
    errors: errorsSignal,
    errorsArray: errorsArraySignal,
    state: stateSignal,
    valid: validSignal,
    touchedState: touchedSignal,
    dirtyState: dirtySignal,
    hidden: hiddenSignal,
    disabled: disabledSignal,
    markAsTouched: () => touchedSignal.set('TOUCHED'),
    markAsDirty: () => dirtySignal.set('DIRTY'),
    registerOnReset: (fn: (value: Value) => void) => onReset = fn,
    reset: () => {
      valueSignal.set(defaultValue);
      touchedSignal.set('UNTOUCHED');
      dirtySignal.set('PRISTINE');
      onReset(defaultValue);
    }
  };
}
