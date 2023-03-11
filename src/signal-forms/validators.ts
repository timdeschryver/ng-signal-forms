import {Signal} from '@angular/core';
import {SetValidationState, Validator} from './validation';

export function required(): Validator {
  return (value: unknown, setState: SetValidationState) => {
    const valid = value !== null && value !== undefined && value !== '';
    if (valid) {
      setState('VALID');
    } else {
      setState('INVALID', {required: true});
    }
  };
}

export function minLength(length: number): Validator<string | Array<unknown>> {
  return (value: string | Array<unknown>, setState: SetValidationState) => {
    const valid =
      value === null || value === undefined || value.length >= length;

    if (valid) {
      setState('VALID');
    } else {
      setState('INVALID', {
        minLength: {
          currentLength: value.length,
          minLength: length,
        },
      });
    }
  };
}

export function equalsTo<Value>(otherValue: Signal<Value>): Validator<Value> {
  return (value: Value, setState: SetValidationState) => {
    const valid = value === otherValue();

    if (valid) {
      setState('VALID');
    } else {
      setState('INVALID', {
        equalsTo: {
          otherValue: otherValue(),
          currentValue: value,
        },
      });
    }
  };
}
