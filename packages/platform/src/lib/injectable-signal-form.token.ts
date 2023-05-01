import {inject, InjectionToken, Provider} from "@angular/core";
import {FormGroup} from "./form-group";
import {FormField} from "./form-field";

export const INJECTABLE_SIGNAL_FORM
  = new InjectionToken<FormGroup | FormField>('ng-signal-form injectable form');

export const createInjectableSignalForm =<Form extends (FormGroup<any> | FormField<any>)> (formCreator: () => Form) => {
  const provideSignalForm = (): Provider => ({
    provide: INJECTABLE_SIGNAL_FORM,
    useFactory: () => formCreator()
  })

  const injectSignalForm = () => inject(INJECTABLE_SIGNAL_FORM as InjectionToken<ReturnType<typeof formCreator>>);

  return {provideSignalForm, injectSignalForm}
}

