import {InjectionToken, WritableSignal} from "@angular/core";

export interface SignalInputModifier {
  onModelChange(value: unknown): void

  registerValueSignal(signal: WritableSignal<unknown>): void;
}

export const SIGNAL_INPUT_MODIFIER = new InjectionToken<SignalInputModifier>('Custom signal input modifier');
