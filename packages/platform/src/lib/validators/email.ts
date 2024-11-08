import { SetValidationState, ValidatorFn } from '../validation';

/**
 * @description Email regex pattern is directly from the Angular Forms definition.
 *              Note: other assumptions on validation differ from Angular reactive forms.
 * @link https://github.com/angular/angular/blob/17.3.2/packages/forms/src/validators.ts#L126
 */
const EMAIL_REGEXP =
  /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export function email(): ValidatorFn {
  return (value: unknown, setState: SetValidationState) => {
    const valid =
      value === null ||
      value === undefined ||
      typeof value !== 'string' ||
      EMAIL_REGEXP.test(value);

    if (valid) {
      setState('VALID');
    } else {
      setState('INVALID', {
        email: {
          details: {
            currentValue: value,
          },
        },
      });
    }
  };
}
