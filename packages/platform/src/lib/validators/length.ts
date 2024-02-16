import { SetValidationState, ValidatorFn } from '../validation';

export function length(length: number): ValidatorFn<string | Array<unknown>> {
  return (value: string | Array<unknown>, setState: SetValidationState) => {
    const valid =
      value === null || value === undefined || value.length === length;

    if (valid) {
      setState('VALID');
    } else {
      setState('INVALID', {
        length: {
          details: {
            currentLength: value.length,
            length: length
          }
        }
      });
    }
  };
}
