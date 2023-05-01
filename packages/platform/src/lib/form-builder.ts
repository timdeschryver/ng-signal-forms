import {inject, Injectable, Injector, WritableSignal} from "@angular/core";
import {FormField, createFormField, FormFieldOptions, FormFieldOptionsCreator} from "./form-field";
import {FormGroup, createFormGroup,FormGroupOptions} from "./form-group";

@Injectable({
  providedIn: 'root'
})
export class SignalFormBuilder {
  private injector = inject(Injector);

  public createFormField<Value>(
    value: Value | WritableSignal<Value>,
    options?: FormFieldOptions | FormFieldOptionsCreator<Value>,
  ): FormField<Value> {
    return createFormField(value, options, this.injector);
  }

  public createFormGroup<
    Controls extends | { [p: string]: FormField | FormGroup }
      | WritableSignal<any[]>
  >(
    formGroupCreator: () => Controls,
    options?: FormGroupOptions
  ): FormGroup<Controls> {
    return createFormGroup(formGroupCreator, options, this.injector);
  }
}
