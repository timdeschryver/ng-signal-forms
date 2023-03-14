import {InjectionToken, Provider, Type} from "@angular/core";

export const SIGNAL_INPUT_ERROR_COMPONENT = new InjectionToken<Type<unknown>>('Custom signal error component');

export const withErrorComponent = (customComponent: Type<unknown>): Provider => ({
  provide: SIGNAL_INPUT_ERROR_COMPONENT,
  useValue: customComponent
})


