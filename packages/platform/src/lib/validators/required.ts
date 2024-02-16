import { SetValidationState, ValidatorFn } from '../validation';

export function required(): ValidatorFn {
  return (value: unknown, setState: SetValidationState) => {
    const valid = value !== null && value !== undefined && value !== '';
    if (valid) {
      setState('VALID');
    } else {
      setState('INVALID', { required: { details: true } });
    }
  };
}
