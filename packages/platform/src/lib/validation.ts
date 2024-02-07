import {computed, effect, Injector, signal, Signal, WritableSignal} from '@angular/core';

export type ValidationError = { details: unknown, message?: string | ((params?: any) => string) };
export type ValidationErrors = Record<string, ValidationError> | null;

export type ValidationState = 'INIT' | 'VALID' | 'PENDING' | 'INVALID';
type SetValidResult = (state: 'VALID') => void;
type SetInvalidResult = (state: 'INVALID', errors: ValidationErrors) => void;
type SetPendingResult = (state: 'PENDING') => void;

export type SetValidationState = SetValidResult &
  SetInvalidResult &
  SetPendingResult;

export type Validator<Value = unknown> = ValidatorFn<Value> | ValidatorObj<Value>;
export type ValidatorFn<Value = unknown> = (
  value: Value,
  setState: SetValidationState
) => void

export type ValidatorObj<Value = unknown> = {
  validator: ValidatorFn<Value>,
  disable?: () => boolean,
  message?: string | ((params?: any) => string)
}
export type ValidateState = { state: ValidationState; errors: ValidationErrors };
export type InvalidDetails = { path: string, key: string, details: unknown, message?: string };

export function createValidateState(): WritableSignal<ValidateState> {
  return signal<{ state: ValidationState; errors: null | Record<string, ValidationError> }>({
    errors: null,
    state: 'INIT',
  });
}

export function executeValidator(state: WritableSignal<ValidateState>, value: unknown, validator: Validator) {
  if (typeof validator === 'function') {
    validator(value, (newState, newErrors?) => {
      state.set({state: newState, errors: (newErrors as ValidationErrors) ?? null});
    });
    return;
  }

  if (!validator.disable || !validator.disable()) {
    validator.validator(value, (newState, newErrors?: ValidationErrors) => {
      if (newErrors) {
        Object.keys(newErrors)
          .forEach((key) => {
            if (validator.message) {
              newErrors[key] = {
                details: newErrors[key].details,
                message: typeof validator.message === 'function' ? validator.message(newErrors[key].details) : validator.message
              }
              return;
            }
            newErrors[key] = {details: newErrors[key].details}
          })
      }
      state.set({state: newState, errors: newErrors ?? null});
    });
  } else {
    state.set({state: 'VALID', errors: null});
  }
  return;
}

export function computeValidators(
  valueSignal: Signal<unknown>,
  validators: Validator[] = [],
  injector?: Injector
) {
  const computedValidatorStates = computed(() => {
    valueSignal();
    return validators.map(() => createValidateState());
  });
  effect(() => {
    computedValidatorStates().forEach((state, index) => {
      executeValidator(state, valueSignal(), validators[index])
    })
  }, {
    allowSignalWrites: true,
    injector
  })
  return computedValidatorStates;
}

export function computeValidateState(
  validateSignal: Signal<Signal<ValidateState>[]>
) {
  return computed(() => validateSignal().map((v) => v()));
}

export function computeErrors(validateSignal: Signal<ValidateState[]>): Signal<Record<string, ValidationError>> {
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
      return [...acc, ...Object.entries(errors.errors)
        .map(([key, {details, message}]) => {
          if (message) {
            return {path: '', key, details, message: typeof message === 'function' ? message(details) : message}
          }
          return {path: '', key, details}
        })];
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
