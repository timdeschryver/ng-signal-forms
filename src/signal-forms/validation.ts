import {computed, signal, Signal} from '@angular/core';

export type ValidationState = 'INIT' | 'VALID' | 'PENDING' | 'INVALID';
type SetValidResult = (state: 'VALID') => void;
type SetInvalidResult = (state: 'INVALID', error: {}) => void;
type SetPendingResult = (state: 'PENDING') => void;

export type SetValidationState = SetValidResult &
  SetInvalidResult &
  SetPendingResult;
export type Validator<Value = unknown> = (
  value: Value,
  setState: SetValidationState
) => void;
export type ValidateState = { state: ValidationState; errors: null | {} };
export type InvalidDetails = { path: string, key: string, details: unknown };

export function createValidateState(
  value: unknown,
  validator: Validator
): Signal<ValidateState> {
  const state = signal<{ state: ValidationState; errors: null | {} }>({
    errors: null,
    state: 'INIT',
  });

  validator(value, (newState, newErrors?) => {
    state.set({state: newState, errors: newErrors ?? null});
  });

  return state;
}

export function computeValidators(
  valueSignal: Signal<unknown>,
  validators: Validator[] = []
) {
  return computed(() => {
    const currentValue = valueSignal();
    return validators.map((validator) =>
      createValidateState(currentValue, validator)
    );
  });
}

export function computeValidateState(
  validateSignal: Signal<Signal<ValidateState>[]>
) {
  return computed(() => validateSignal().map((v) => v()));
}

export function computeErrors(validateSignal: Signal<ValidateState[]>) {
  return computed(() => {
    return validateSignal().reduce((acc, errors) => {
      if (!errors.errors) {
        return acc;
      }
      return {...acc, ...errors.errors};
    }, {});
  });
}

export function computeErrorsArray(validateSignal: Signal<ValidateState[]>) {
  return computed(() => {
    return validateSignal().reduce((acc, errors) => {
      if (!errors.errors) {
        return acc;
      }
      return [...acc, ...Object.entries(errors.errors).map(([key, details]) => ({path: '', key, details}))];
    }, [] as InvalidDetails[])
  });
}


export function computeState(validateSignal: Signal<ValidateState[]>) {
  return computed(() => {
    const errors = validateSignal();
    if (errors.some((v) => v.state === 'INVALID')) {
      return 'INVALID';
    }
    if (errors.some((v) => v.state === 'PENDING')) {
      return 'PENDING';
    }
    return 'VALID';
  });
}
