import {Directive, forwardRef, Input, OnDestroy, Signal, WritableSignal} from '@angular/core';
import {SIGNAL_INPUT_MODIFIER, SignalInputModifier} from "./signal-input-modifier.token";
import {debounceTime, Subject, Subscription} from "rxjs";

export const DEBOUNCE_MODIFIER: any = {
  provide: SIGNAL_INPUT_MODIFIER,
  useExisting: forwardRef(() => SignalInputDebounceDirective),
  multi: true
};

@Directive({
  selector: '[ngModel][formField][debounce]',
  standalone: true,
  providers: [DEBOUNCE_MODIFIER]
})
export class SignalInputDebounceDirective implements SignalInputModifier, OnDestroy {
  private _debounced = new Subject<unknown>();
  private _debouncedSub: Subscription | null = null;
  private _signalToDebounce?: WritableSignal<unknown>

  @Input()
  set debounce(value: number) {
    this._debouncedSub?.unsubscribe();
    this._debouncedSub = this._debounced.pipe(debounceTime(value))
      .subscribe(value => this._signalToDebounce?.set(value));
  }

  public registerValueSignal(valueSignal: WritableSignal<unknown>): void {
    this._signalToDebounce = valueSignal
  }

  public onModelChange(value: unknown): void {
    this._debounced.next(value);
  }

  public ngOnDestroy() {
    this._debouncedSub?.unsubscribe();
    this._debouncedSub = null;
  }
}
