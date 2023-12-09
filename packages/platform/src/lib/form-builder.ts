import { inject, Injectable, Injector, WritableSignal } from '@angular/core';
import {
  FormField,
  createFormField,
  FormFieldOptions,
  FormFieldOptionsCreator,
} from './form-field';
import { FormGroup, createFormGroup, FormGroupOptions } from './form-group';
import { FormGroupCreator } from './models';

@Injectable({
  providedIn: 'root',
})
export class SignalFormBuilder {
  private injector = inject(Injector);

  public createFormField<Value>(
    value: Value | WritableSignal<Value>,
    options?: FormFieldOptions | FormFieldOptionsCreator<Value>
  ): FormField<Value> {
    return createFormField(value, options, this.injector);
  }

  public createFormGroup<FormFields extends FormGroupCreator>(
    formGroupCreator: FormFields | (() => FormFields),
    options?: FormGroupOptions
  ): FormGroup<FormFields> {
    return createFormGroup<FormFields>(
      formGroupCreator,
      options,
      this.injector
    );
  }
}
