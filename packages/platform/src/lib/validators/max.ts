import { SetValidationState, ValidatorFn } from '../validation';

export function max(maxValue: number): ValidatorFn<string | Array<unknown>> {
  return (value: number | unknown, setState: SetValidationState) => {
    const valid =
      value === null || value === undefined || typeof value !== 'number' || value <= maxValue;

    if (valid) {
      setState('VALID');
    } else {
      setState('INVALID', {
        max: {
          details: {
            current: value,
            max: maxValue
          }
        }
      });
    }
  };
}
