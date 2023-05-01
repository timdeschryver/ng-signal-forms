import {AfterViewInit, Directive, inject, InjectionToken, Injector, ViewContainerRef} from '@angular/core';
import {SIGNAL_INPUT_ERROR_COMPONENT} from "./signal-input-error.token";
import {SignalInputDirective} from "./signal-input.directive";
import {FormField} from "./form-field";


const SIGNAL_INPUT_ERROR_FIELD= new InjectionToken<FormField>('Signal input error form field');

export const injectErrorField = () => inject(SIGNAL_INPUT_ERROR_FIELD);

@Directive({
  selector: '[ngModel][formField]',
  standalone: true,
})
export class SignalInputErrorDirective implements AfterViewInit{
   private readonly viewContainerRef = inject(ViewContainerRef);
   private readonly signalInput = inject(SignalInputDirective, {optional: true});
   private readonly component = inject(SIGNAL_INPUT_ERROR_COMPONENT);

  ngAfterViewInit() {
    Promise.resolve().then(() => {
      if (!this.component) {
        throw new Error('No error component provided. Please add one using the withErrorComponent function.')
      }
      if (this.signalInput) {
        this.viewContainerRef.createComponent(this.component, {
          injector: Injector.create({providers: [
              {
                provide: SIGNAL_INPUT_ERROR_FIELD,
                useValue: this.signalInput.formField
              }
            ]})
        })
      }
    })
  }
}
