import {InjectionToken} from "@angular/core";

export interface SignalInputModifier {
  onModelChange(value: unknown): void

  registerOnSet(set: (value: unknown) => void): void;
}

export const SIGNAL_INPUT_MODIFIER = new InjectionToken<SignalInputModifier>('Custom signal input modifier');
