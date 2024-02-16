import { isSignal, Signal } from '@angular/core';
import { SetValidationState, ValidatorFn } from '../validation';

export function equalsTo<Value>(otherValue: Value | Signal<Value>): ValidatorFn<Value> {
  return (value: Value, setState: SetValidationState) => {
    const other = isSignal(otherValue) ? otherValue() : otherValue;
    const valid = value == null || value === undefined || value === other;

    if (valid) {
      setState('VALID');
    } else {
      setState('INVALID', {
        equalsTo: {
          details: {
            otherValue: other,
            currentValue: value
          }
        }
      });
    }
  };
}
