import {computed, signal, Signal} from '@angular/core';

export type ValidationState = 'INIT' | 'VALID' | 'PENDING' | 'INVALID';
type SetValidResult = (state: 'VALID') => void;
type SetInvalidResult = (state: 'INVALID', errors: {}) => void;
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
  message?: (params?: any) => string
}
export type ValidateState = { state: ValidationState; errors: null | {} };
export type InvalidDetails = { path: string, key: string, details: unknown, message?: string };

export function createValidateState(
  value: unknown,
  validator: Validator
): Signal<ValidateState> {
  const state = signal<{ state: ValidationState; errors: null | {} }>({
    errors: null,
    state: 'INIT',
  });

  if (typeof validator === 'function') {
    validator(value, (newState, newErrors?) => {
      state.set({state: newState, errors: newErrors ?? null});
    });
    return state;
  }

  if (!validator.disable || !validator.disable()) {
    validator.validator(value, (newState, newErrors?) => {
      //todo: improve types
      let errors: any = newErrors ?? null;
      if (errors && validator.message) {
        Object.keys(errors)
          .forEach((key) => errors[key] = ({
            [key]: errors[key],
            message: validator.message
          }))
      }
      state.set({state: newState, errors});
    });
  }
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

      const unwrappedErrors = Object.entries(errors.errors)
        .map(([key, details]) => {
          //todo: improve types
          if ((details as any).message) {
            const {message, ...newDetails} = (details as any);
            return Object.keys(newDetails).length === 1 && newDetails[key] ? newDetails[key] : newDetails
          }
          return details
        });

      if (unwrappedErrors.length === 1) {
        const key = Object.keys(errors.errors)[0];
        return {...acc, [key]: unwrappedErrors[0]}
      }
      return {...acc, ...unwrappedErrors};
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
        .map(([key, details]) => {
          //todo: improve types
          if ((details as any).message) {
            const {message, ...newDetails} = (details as any);
            const rawValueExtractedDetails = Object.keys(newDetails).length === 1 && newDetails[key] ? newDetails[key] : newDetails
            return {path: '', key, details: rawValueExtractedDetails, message: message(rawValueExtractedDetails)}
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
