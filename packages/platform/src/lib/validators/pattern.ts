import { SetValidationState, ValidatorFn } from '../validation';

export function pattern(regexp: RegExp): ValidatorFn {
  return (value: unknown, setState: SetValidationState) => {
    const valid = value === null || value === undefined || typeof value !== 'string' || regexp.test(value);
    if (valid) {
      setState('VALID');
    } else {
      setState('INVALID', { pattern: { details: { pattern: regexp, currentValue: value } } });
    }
  };
}
