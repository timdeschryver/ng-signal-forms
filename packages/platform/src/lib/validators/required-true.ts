import { SetValidationState, ValidatorFn } from '../validation';

export function requiredTrue(): ValidatorFn {
  return (value: unknown, setState: SetValidationState) => {
    const valid = value === true;
    if (valid) {
      setState('VALID');
    } else {
      setState('INVALID', { requiredTrue: { details: true } });
    }
  };
}
